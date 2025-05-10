import pandas as pd

def calculate_elo(df, k=20, base_elo=1500):
    # Initialize ELO ratings 
    elo  = {team: base_elo for team in df['Player_1'].unique()}
    elo_history = []
    
    df = df.sort_values('Date')
    for _, row in df.iterrows():
        player_1 = row['Player_1']
        player_2 = row['Player_2']
        result = 1 if row['Result'] == 'W' else 0