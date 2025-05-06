#!/usr/bin/env python3
"""
nba_pipeline.py

Comprehensive NBA win-probability pipeline with progress checkers:
  - prepare: load raw totals CSV, compute features (rolling averages, rest days, home/away, win streak, ELO, opponent ELO, ELO diff)
  - train: temporal split, expanded hyperparameter grids for RF & XGBoost, stacking ensemble, verbose progress
  - predict: interactive CLI for head-to-head probability, accepts either team IDs or partial team names/abbreviations

Usage:
  # Prepare features (with adjustable ELO k-factor)
  python nba_pipeline.py prepare \
      --input data/regular_season_totals_2010_2024.csv \
      --output data/regular_season_elo_processed.csv \
      --window 5 --k_factor 30

  # Train model
  python nba_pipeline.py train \
      --input data/regular_season_elo_processed.csv \
      --model data/nba_pipeline_model_refined.joblib

  # Predict matchup (by ID or name/abbr)
  python nba_pipeline.py predict \
      --model data/nba_pipeline_model_refined.joblib \
      --team1 Lakers --team2 Warriors
"""
import argparse
import pandas as pd
import numpy as np
import joblib
import time
from datetime import datetime
from nba_api.stats.static import teams
from nba_api.stats.endpoints import teamgamelogs
from sklearn.ensemble import RandomForestClassifier, StackingClassifier
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import accuracy_score


def prepare_features(input_path, output_path, window=5, k_factor=30):
    start = time.time()
    print(f"[Prepare] Starting feature preparation at {datetime.now().isoformat()}")
    df = pd.read_csv(input_path, parse_dates=['GAME_DATE'])
    df.sort_values(['TEAM_ID', 'GAME_DATE'], ascending=[True, True], inplace=True)

    teams_list = teams.get_teams()
    abbr_to_id = {t['abbreviation']: t['id'] for t in teams_list}

    # Extract opponent ID from matchup abbreviation
    df['OPPONENT_TEAM_ABBR'] = df['MATCHUP'].apply(lambda m: m.split()[-1])
    df['OPPONENT_TEAM_ID'] = df['OPPONENT_TEAM_ABBR'].map(abbr_to_id)

    # Basic features
    df['WIN_FLAG'] = df['WL'].map({'W':1,'L':0})
    df['REST_DAYS'] = df.groupby('TEAM_ID')['GAME_DATE'].diff().dt.days.fillna(0)
    df['HOME_GAME'] = df['MATCHUP'].apply(lambda x: 1 if 'vs.' in x else 0)
    df['WIN_STREAK'] = df.groupby('TEAM_ID')['WIN_FLAG'] \
        .transform(lambda x: x.groupby((x != x.shift()).cumsum()).cumcount() + 1)

    # Compute ELO history
    elo = {tid:1500 for tid in df['TEAM_ID'].unique()}
    records = []
    total = len(df)
    print(f"[Prepare] Computing ELO for {total} games...")
    for i, row in enumerate(df.itertuples(), 1):
        t, o, res = row.TEAM_ID, row.OPPONENT_TEAM_ID, row.WIN_FLAG
        if pd.isna(o): o = t
        r_t, r_o = elo.get(t,1500), elo.get(o,1500)
        exp_t = 1 / (1 + 10 ** ((r_o - r_t) / 400))
        elo[t] = r_t + k_factor * (res - exp_t)
        elo[o] = r_o + k_factor * ((1-res) - (1-exp_t))
        records.append((row.GAME_DATE, t, elo[t], o, elo[o]))
        if i % 1000 == 0 or i == total:
            print(f"[Prepare] ELO progress: {i}/{total} games processed")

    elo_df = pd.DataFrame(records, columns=['GAME_DATE','TEAM_ID','TEAM_ELO','OPPONENT_TEAM_ID','OPPONENT_ELO'])
    df = df.merge(elo_df, on=['GAME_DATE','TEAM_ID','OPPONENT_TEAM_ID'], how='left')
    df['ELO_DIFF'] = df['TEAM_ELO'] - df['OPPONENT_ELO']

    # Rolling averages
    stats = ['PTS','REB','AST','STL','BLK']
    print(f"[Prepare] Computing rolling averages (window={window})...")
    roll = (df.groupby('TEAM_ID')[stats]
              .rolling(window=window, min_periods=1)
              .mean()
              .reset_index(level=0, drop=True)
              .add_suffix(f'_avg{window}'))
    df = pd.concat([df.reset_index(drop=True), roll.reset_index(drop=True)], axis=1)

    df.to_csv(output_path, index=False)
    elapsed = time.time() - start
    print(f"[Prepare] Completed in {elapsed:.1f}s. Saved to {output_path}")


def train_model(input_path, model_path):
    start = time.time()
    print(f"[Train] Starting training at {datetime.now().isoformat()}")
    df = pd.read_csv(input_path, parse_dates=['GAME_DATE'])
    train_df = df[df['GAME_DATE'] < '2022-01-01']
    test_df = df[df['GAME_DATE'] >= '2022-01-01']

    feat_cols = [
        'PTS_avg5','REB_avg5','AST_avg5','STL_avg5','BLK_avg5',
        'REST_DAYS','HOME_GAME','WIN_STREAK','ELO_DIFF'
    ]
    X_train, y_train = train_df[feat_cols], train_df['WIN_FLAG']
    X_test,  y_test  = test_df[feat_cols],  test_df['WIN_FLAG']

    print("[Train] Tuning Random Forest...")
    rf_search = GridSearchCV(
        RandomForestClassifier(random_state=42),
        {
            'n_estimators': [300,500,1000,1200],
            'max_depth': [None,10,20,30,40,50],
            'max_features': ['sqrt','log2','auto'],
            'min_samples_split': [2,5,10,15]
        }, cv=5, scoring='accuracy', n_jobs=-1, verbose=2
    )
    rf_search.fit(X_train, y_train)
    best_rf = rf_search.best_estimator_
    print(f"[Train] RF best params: {rf_search.best_params_}")

    # XGBoost
    try:
        from xgboost import XGBClassifier
        print("[Train] Tuning XGBoost...")
        xgb = XGBClassifier(eval_metric='logloss', use_label_encoder=False, random_state=42)
        xgb_search = GridSearchCV(
            xgb, {'n_estimators':[100,300,500], 'max_depth':[3,5,7,9], 'learning_rate':[0.01,0.1,0.2]},
            cv=5, scoring='accuracy', n_jobs=-1, verbose=2
        )
        xgb_search.fit(X_train, y_train)
        best_xgb = xgb_search.best_estimator_
        print(f"[Train] XGB best params: {xgb_search.best_params_}")
    except ImportError:
        best_xgb = None
        print("[Train] XGBoost not installed; skipping.")

    print("[Train] Building stacking ensemble...")
    estimators = [('rf', best_rf)]
    if best_xgb:
        estimators.append(('xgb', best_xgb))
    stack = StackingClassifier(
        estimators=estimators,
        final_estimator=RandomForestClassifier(n_estimators=100, random_state=42),
        cv=5, n_jobs=-1, verbose=2
    )
    stack.fit(X_train, y_train)
    y_pred = stack.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"[Train] Stacking accuracy on hold-out: {acc:.2%}")

    joblib.dump(stack, model_path)
    elapsed = time.time() - start
    print(f"[Train] Completed in {elapsed:.1f}s. Model saved to {model_path}")


def resolve_team_id(identifier):
    if identifier.isdigit():
        return int(identifier)
    all_teams = teams.get_teams()
    matches = [t for t in all_teams if identifier.lower() in t['full_name'].lower() or identifier.lower() in t['abbreviation'].lower()]
    if not matches:
        raise ValueError(f"No team found matching '{identifier}'")
    if len(matches) > 1:
        print("Multiple matches found:")
        for i, t in enumerate(matches, 1):
            print(f" {i}. {t['full_name']} ({t['abbreviation']})")
        choice = int(input("Select team number: ").strip())
        return matches[choice-1]['id']
    return matches[0]['id']


def predict_matchup(model_path, team1, team2):
    model = joblib.load(model_path)
    df = pd.read_csv('data/regular_season_elo_processed.csv', parse_dates=['GAME_DATE'])

    t1 = resolve_team_id(team1)
    t2 = resolve_team_id(team2)
    print(f"[Predict] Team1 ID={t1}, Team2 ID={t2}")

    def get_latest_features(tid):
        row = df[df['TEAM_ID'] == tid].iloc[-1]
        return pd.DataFrame([{
            'PTS_avg5': row['PTS_avg5'],
            'REB_avg5': row['REB_avg5'],
            'AST_avg5': row['AST_avg5'],
            'STL_avg5': row['STL_avg5'],
            'BLK_avg5': row['BLK_avg5'],
            'REST_DAYS': row['REST_DAYS'],
            'HOME_GAME': row['HOME_GAME'],
            'WIN_STREAK': row['WIN_STREAK'],
            'ELO_DIFF': row['ELO_DIFF']
        }])

    print(f"[Predict] Computing probability for {team1} vs {team2}...")
    f1 = get_latest_features(t1)
    f2 = get_latest_features(t2)
    X_matchup = f1.subtract(f2).reset_index(drop=True)

    proba = model.predict_proba(X_matchup)[0][1]
    print(f"[Predict] Win probability Team {t1} vs Team {t2}: {proba:.2%}")


def main():
    parser = argparse.ArgumentParser(prog='nba_pipeline.py')
    sub = parser.add_subparsers(dest='cmd')

    sp = sub.add_parser('prepare')
    sp.add_argument('--input', required=True)
    sp.add_argument('--output', required=True)
    sp.add_argument('--window', type=int, default=5)
    sp.add_argument('--k_factor', type=int, default=30,
                    help='ELO k-factor for rating updates')

    sp = sub.add_parser('train')
    sp.add_argument('--input', required=True)
    sp.add_argument('--model', required=True)

    sp = sub.add_parser('predict')
    sp.add_argument('--model', required=True)
    sp.add_argument('--team1', required=True,
                    help='Team ID or partial team name/abbr')
    sp.add_argument('--team2', required=True,
                    help='Team ID or partial team name/abbr')

    args = parser.parse_args()
    if args.cmd == 'prepare':
        prepare_features(args.input, args.output, args.window, args.k_factor)
    elif args.cmd == 'train':
        train_model(args.input, args.model)
    elif args.cmd == 'predict':
        predict_matchup(args.model, args.team1, args.team2)
    else:
        parser.print_help()

if __name__ == '__main__':
    main()
