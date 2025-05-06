import pandas as pd

# Load original data
df = pd.read_csv("data/regular_season_totals_2010_2024.csv", parse_dates=['GAME_DATE'])

# Sort properly
df = df.sort_values(['TEAM_ID', 'GAME_DATE'], ascending=[True, False])

# Compute rolling averages clearly with '_avg5' suffix
stats = ['PTS', 'REB', 'AST', 'STL', 'BLK']
rolling = (
    df.groupby('TEAM_ID')[stats]
      .rolling(window=5, min_periods=1)
      .mean()
      .reset_index(level=0, drop=True)
      .add_suffix('_avg5')
)

# Merge with the original data
df_processed = pd.concat([df.reset_index(drop=True), rolling.reset_index(drop=True)], axis=1)

# Save clearly
df_processed.to_csv("data/regular_season_processed.csv", index=False)

# Check the columns after saving
print(df_processed.columns.tolist())
