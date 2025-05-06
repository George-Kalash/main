import joblib
import pandas as pd

rf = joblib.load("data/nba_rf_model.joblib")
df = pd.read_csv("data/regular_season_elo_processed.csv")

def get_team_features(team_id):
    team_row = df[df['TEAM_ID'] == team_id].iloc[-1]
    return team_row[['PTS_avg5', 'REB_avg5', 'AST_avg5', 'STL_avg5', 'BLK_avg5', 'TEAM_ELO']]

team1_id = int(input("Team 1 ID: "))
team2_id = int(input("Team 2 ID: "))

team1_features = get_team_features(team1_id)
team2_features = get_team_features(team2_id)

matchup_features = (team1_features - team2_features).values.reshape(1, -1)
prob = rf.predict_proba(matchup_features)[0, 1]

print(f"Win Probability Team {team1_id}: {prob:.2%}")
