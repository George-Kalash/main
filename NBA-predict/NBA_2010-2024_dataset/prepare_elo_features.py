import pandas as pd

# Load original CSV clearly
df = pd.read_csv("data/regular_season_totals_2010_2024.csv", parse_dates=['GAME_DATE'])

# Sort data chronologically
df.sort_values(['TEAM_ID', 'GAME_DATE'], ascending=[True, True], inplace=True)

# Extract opponent team ID from MATCHUP column
def extract_opponent_team_id(matchup, team_id):
    teams = matchup.split(' vs. ') if 'vs.' in matchup else matchup.split(' @ ')
    opponent = [team.strip() for team in teams if str(team_id) not in team][0]
    return opponent

df['OPPONENT_TEAM'] = df.apply(lambda row: extract_opponent_team_id(row['MATCHUP'], row['TEAM_ID']), axis=1)

# Prepare the ELO calculation clearly
def calculate_elo(df, k=20, base_elo=1500):
    elo = {team: base_elo for team in df['TEAM_ID'].unique()}
    elo_history = []

    for _, row in df.iterrows():
        team = row['TEAM_ID']
        opp = row['OPPONENT_TEAM']
        result = 1 if row['WL'] == 'W' else 0

        elo_team = elo.get(team, base_elo)
        elo_opp = elo.get(opp, base_elo)

        exp_team = 1 / (1 + 10 ** ((elo_opp - elo_team) / 400))

        elo[team] = elo_team + k * (result - exp_team)
        elo[opp] = elo_opp + k * ((1 - result) - (1 - exp_team))

        elo_history.append({
            'GAME_DATE': row['GAME_DATE'],
            'TEAM_ID': team,
            'TEAM_ELO': elo[team],
            'OPPONENT_TEAM_ID': opp,
            'OPPONENT_ELO': elo[opp],
            'WL': result
        })

    return pd.DataFrame(elo_history)

# Run and merge the ELO ratings
elo_df = calculate_elo(df)

# Merge ELO into original dataset
df = df.merge(elo_df[['GAME_DATE', 'TEAM_ID', 'TEAM_ELO']], on=['GAME_DATE', 'TEAM_ID'], how='left')

# Compute rolling averages (5 games window)
stats = ['PTS', 'REB', 'AST', 'STL', 'BLK']
rolling = (
    df.groupby('TEAM_ID')[stats]
      .rolling(window=5, min_periods=1)
      .mean()
      .reset_index(level=0, drop=True)
      .add_suffix('_avg5')
)

# Final prepared dataset
final_df = pd.concat([df.reset_index(drop=True), rolling.reset_index(drop=True)], axis=1)

# Save processed data clearly
final_df.to_csv("data/regular_season_elo_processed.csv", index=False)

print("ELO processed dataset ready: data/regular_season_elo_processed.csv")
