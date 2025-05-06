#!/usr/bin/env python3
import sys
import joblib
import numpy as np
import pandas as pd
from nba_api.stats.endpoints import teamgamelogs
from nba_api.stats.static import teams

MODEL_PATH = "rf_pipeline.joblib"
SEASON    = "2023-24"
WINDOW    = 5

def get_team_id(name):
    matches = [t for t in teams.get_teams() if name.lower() in t['full_name'].lower()]
    if not matches: raise ValueError(f"No team matching '{name}'")
    if len(matches)>1:
        for i,t in enumerate(matches,1): print(f"{i}. {t['full_name']}")
        sel = int(input("Select team #: "))
        return matches[sel-1]['id']
    return matches[0]['id']

def fetch_avg_stats(tid, season=SEASON, window=WINDOW):
    df = teamgamelogs.TeamGameLogs(
        team_id_nullable=tid,
        season_nullable=season,
        season_type_nullable="Regular Season"
    ).get_data_frames()[0]
    stats = ['PTS','REB','AST','STL','BLK']
    df_num = df[stats].head(window).apply(pd.to_numeric, errors='coerce')
    avg = df_num.mean()
    return avg.values  # array of length 5

def main():
    team1 = input("Team 1: ").strip()
    team2 = input("Team 2: ").strip()
    t1_id = get_team_id(team1)
    t2_id = get_team_id(team2)
    print(f"Team1 ID={t1_id}, Team2 ID={t2_id}")

    # Load pre‐trained model
    model = joblib.load(MODEL_PATH)

    # Build feature: difference of last‐5‐game avgs
    a1 = fetch_avg_stats(t1_id)
    a2 = fetch_avg_stats(t2_id)
    X  = (a1 - a2).reshape(1,-1)  # shape (1,5)

    proba = model.predict_proba(X)[0,1]
    print(f"\nWin probability for {team1} over {team2}: {proba*100:.1f}%")

if __name__ == "__main__":
    main()
