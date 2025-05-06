#!/usr/bin/env python3
import logging
import joblib
import pandas as pd
from nba_api.stats.endpoints import teamgamelogs
from nba_api.stats.static import teams
from sklearn.ensemble import RandomForestClassifier
from sklearn.calibration import CalibratedClassifierCV
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import accuracy_score

logging.basicConfig(level=logging.INFO, format='%(message)s')


def fetch_team_stats(tid, season="2023-24", window=5):
    """
    Fetch the last `window` games of PTS, REB, AST, STL, BLK for a team,
    and return their averages as a pandas Series.
    """
    logs = teamgamelogs.TeamGameLogs(
        team_id_nullable=tid,
        season_nullable=season,
        season_type_nullable="Regular Season"
    ).get_data_frames()[0]
    stats = ['PTS', 'REB', 'AST', 'STL', 'BLK']
    df_num = logs[stats].head(window).apply(pd.to_numeric, errors='coerce')
    return df_num.mean().rename(lambda c: f"{c}_avg")  # Series


def build_dataset(season="2023-24", window=5):
    """
    Build features X and labels y for all NBA teams:
    - X: DataFrame indexed by TEAM_ID with columns PTS_avg, REB_avg, etc.
    - y: Series indexed by TEAM_ID where 1=win last game, 0=loss.
    """
    rows = []
    labels = {}
    for t in teams.get_teams():
        tid = t['id']
        logs = teamgamelogs.TeamGameLogs(
            team_id_nullable=tid,
            season_nullable=season,
            season_type_nullable="Regular Season"
        ).get_data_frames()[0]
        if logs.empty:
            continue
        labels[tid] = 1 if logs.iloc[0]['WL'] == 'W' else 0
        stats_series = fetch_team_stats(tid, season, window)
        stats_series['TEAM_ID'] = tid
        rows.append(stats_series)
    X = pd.DataFrame(rows).set_index('TEAM_ID')
    y = pd.Series(labels).loc[X.index]
    return X, y


def train_and_persist(path="rf_pipeline.joblib"):
    X, y = build_dataset()
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    param_grid = {
        'n_estimators': [100, 300],
        'max_depth': [None, 10],
        'max_features': ['sqrt', 'log2']
    }
    grid = GridSearchCV(
        RandomForestClassifier(random_state=42, oob_score=True),
        param_grid, cv=3, scoring='accuracy', n_jobs=-1
    )
    grid.fit(X_train, y_train)
    best = grid.best_estimator_
    logging.info(f"Best params: {grid.best_params_}")
    logging.info(f"OOB score: {best.oob_score_:.3f}")
    calib = CalibratedClassifierCV(best, cv=3, method='sigmoid')
    calib.fit(X_train, y_train)
    y_pred = calib.predict(X_test)
    logging.info(f"Test accuracy: {accuracy_score(y_test, y_pred):.3f}")
    joblib.dump(calib, path)
    logging.info(f"Serialized pipeline to {path}")


if __name__ == "__main__":
    train_and_persist()
