import pandas as pd

def calculate_elo(df, k=20, base_elo=1500):
    # Initialize ELO ratings
    elo = {team: base_elo for team in df['TEAM_ID'].unique()}
    elo_history = []

    # Sort chronologically
    df = df.sort_values('GAME_DATE')

    for _, row in df.iterrows():
        team = row['TEAM_ID']
        opp = row['OPPONENT_TEAM_ID']
        result = 1 if row['WL'] == 'W' else 0

        elo_team = elo[team]
        elo_opp = elo[opp]

        # Expected result
        exp_team = 1 / (1 + 10 ** ((elo_opp - elo_team) / 400))

        # Update ELO ratings
        elo[team] += k * (result - exp_team)
        elo[opp] += k * ((1 - result) - (1 - exp_team))

        elo_history.append({
            'GAME_DATE': row['GAME_DATE'],
            'TEAM_ID': team,
            'ELO': elo[team],
            'OPPONENT_TEAM_ID': opp,
            'OPPONENT_ELO': elo[opp],
            'RESULT': result
        })

    return pd.DataFrame(elo_history)
