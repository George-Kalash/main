import time
from tqdm import tqdm
import pandas as pd
from nba_api.stats.endpoints import TeamGameLogs
from refine import refine_data

seasons = [f"{yr}-{str(yr+1)[2:]}" for yr in range(1996, 2025)]

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
