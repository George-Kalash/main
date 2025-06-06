import time
import os
from tqdm import tqdm
import pandas as pd
from nba_api.stats.endpoints import TeamGameLogs
from ELOCalculation import analyze_elo
from refine import refine_data
from refine import get_win_loss_ratio

def get_data():
    current_time = time.time()
    year = time.localtime(current_time).tm_year # gets latest games based on the current year

    seasons = [f"{yr}-{str(yr+1)[2:]}" for yr in range(2002, year + 1)]

    frames = []
    for season in tqdm(seasons):
        logs = TeamGameLogs(
            season_nullable=season,
            season_type_nullable="Regular Season",
            league_id_nullable="00"
        ).get_data_frames()[0]
        if not logs.empty:               # skip blank seasons
            frames.append(logs)
        time.sleep(0.7)

    clean_df = refine_data(frames)       # list OK now

    df_sorted = clean_df.sort_values("GAME_DATE", ascending=False)

    df_sorted.to_csv("nba_games_1996_2025.csv", index=False)

    # save_elo_ratings()  # calculate and save Elo ratings
    print("NBA data collection and ELO ratings calculation completed.")
