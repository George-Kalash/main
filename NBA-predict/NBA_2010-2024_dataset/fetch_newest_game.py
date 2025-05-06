#!/usr/bin/env python3
import pandas as pd
import time
from nba_api.stats.static import teams
from nba_api.stats.endpoints import teamgamelogs


def get_last_processed_date(path="data/regular_season_processed.csv"):
  df = pd.read_csv(path, parse_dates=['GAME_DATE'])
  last_date = df['GAME_DATE'].max()
  print(f"▶️ Last processed date in CSV: {last_date.date()}")
  return last_date


def fetch_new_totals(last_date, season="2023-24"):
  all_new = []
  for team in teams.get_teams():
    tid = team['id']
    abbrev = team['abbreviation']
    logs = teamgamelogs.TeamGameLogs(
      team_id_nullable=tid,
      season_nullable=season,
      season_type_nullable="Regular Season"
    ).get_data_frames()[0]
    # parse dates if not already
    logs['GAME_DATE'] = pd.to_datetime(logs['GAME_DATE'])

    # debug: show max date returned for this team
    max_api_date = logs['GAME_DATE'].max().date() if not logs.empty else None
    print(f"  • {abbrev} ({tid}): API max date = {max_api_date}, rows = {len(logs)}")

    # filter only strictly newer games
    new_games = logs[logs['GAME_DATE'] > last_date]
    if not new_games.empty:
      print(f"    ↳ Found {len(new_games)} new rows for {abbrev}")
      all_new.append(new_games)

    time.sleep(0.6)  # avoid hammering the API
  if all_new:
    combined = pd.concat(all_new, ignore_index=True)
    print(f"\n✅ Total new games found: {len(combined)}")
    return combined
  else:
    print("\nℹ️ No new games found for any team.")
    return pd.DataFrame()  # empty


def main():
  last_date = get_last_processed_date()

  # **Make sure this season string matches the one in your processed CSV**
  # If your CSV goes through 2023-24 only, then season="2023-24" is correct.
  # If you want to pull early 2024-25 data, change to season="2024-25".
  new_df = fetch_new_totals(last_date, season="2023-24")

  if not new_df.empty:
    # append to your CSV or process as you like
    new_df.to_csv("data/new_games_since_last.csv", index=False)
    print("Saved all-new games to data/new_games_since_last.csv")
  else:
    print("Nothing to append.")


if __name__ == "__main__":
  main()
