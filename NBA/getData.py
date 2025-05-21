import time, tqdm, pandas as pd
from nba_api.stats.static import teams
from nba_api.stats.endpoints import TeamGameLogs

team_meta = teams.get_teams()
teams_df = pd.DataFrame(team_meta)

# print(teams_df)

seasons = [f"{yr}-{str(yr+1)[2:]}"           # 1980-81, 1981-82, …
           for yr in range(1980, 2025)]      # stop at 2024-25

all_frames = []

for season in tqdm.tqdm(seasons):
    logs = TeamGameLogs(
        season_nullable       = season,
        season_type_nullable  = "Regular Season",   # or "Playoffs"
        league_id_nullable    = "00"               # NBA
    ).get_data_frames()[0]
    all_frames.append(logs)
    time.sleep(0.7)  
    
games_80_25 = pd.concat(all_frames, ignore_index=True)
games_80_25.to_csv("nba_games_1980_2025.csv", index=False)