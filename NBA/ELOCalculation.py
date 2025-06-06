import pandas as pd 


def win_probability(rating1, rating2):
    return 1 / (1 + (10 ** ((rating1 - rating2) / 500))) 

def  dynamic_k_factor(games_played, K0, K_min):
  """
  Calculates the dynamic K-factor based on the ratings of two players/teams.
  Args:
      games_played (int): Number of games played by the player/team.
      K0 (float): Initial K-factor.
      K_min (float): Minimum K-factor.
  """
  new_K = max(K_min, K0/ ((games_played + 1) ** 0.5))
  return new_K
  
  
def elo_rating(Ra=1400, Rb=1400, k=30, outcome=1):
    Pa = win_probability(Ra, Rb)
    Pb = win_probability(Rb, Ra)
    
    Ra += k * (outcome - Pa)
    Rb += k * ((1 - outcome) - Pb)
    #  Hard floor for ELO
    # Ra = max(Ra, -200)
    # Rb = max(Rb, -200)

    # print(f"Updated Ratings: Ra = {Ra}, Rb = {Rb}")
    return Ra, Rb
  
def analyze_elo(csv_file="nba_games_1996_2025.csv"):
    """
    Analyze Elo ratings for NBA teams based on game resuts.
    Args:
        csv_file (str, optional): _description_. Defaults to "nba_games_1996_2025.csv".
    """
    
    Alpha = 0.78
    K_min = 5
    K0 = 30  # Initial K-factor
    Baseline = 1400  # Baseline Elo rating for new teams    

    gamesPlayed = {}
    
    df = pd.read_csv(csv_file)
    elo_ratings = {}
    games = []  # Use a list to store game dictionaries
    current_season = None  # e.g., use year extracted from row['GAME_DATE']
    
    for index, row in df.iterrows():
      if row['HOME_AWAY'] != "vs":
        continue
      season = row['SEASON_YEAR']  # example: use year from date
      if current_season is None:
        current_season = season
      elif season != current_season:
        # Reset ratings or regress toward Baseline for a new season
        for team in elo_ratings:
            elo_ratings[team] = elo_ratings[team] * Alpha   # or apply a regression factor
        current_season = season
      
      home_team = row['TEAM_ABBREVIATION']
      away_team = row['OPPONENT_ABBREVIATION']
      home_score = row['PTS']
      away_score = row['PTS'] - row['PLUS_MINUS'] 
      outcome = 1 if row['OUTCOME'] == 'W' else 0
      
      # Initialize ratings if teams are not already in the dictionary
      if home_team not in elo_ratings:
        elo_ratings[home_team] = Baseline
        gamesPlayed[home_team] = 0
      if away_team not in elo_ratings:
        elo_ratings[away_team] = Baseline
        gamesPlayed[away_team] = 0
      
      # Update Elo ratings based on the game result
      K_home = dynamic_k_factor(gamesPlayed[home_team], K0, K_min)
      K_away = dynamic_k_factor(gamesPlayed[away_team], K0, K_min)
      
      k_used = min(K_home, K_away)  # Use the smaller K-factor for both teams

      old_home_elo = elo_ratings[home_team]
      old_away_elo = elo_ratings[away_team]
      new_home_elo, new_away_elo = elo_rating(old_home_elo, old_away_elo, k_used, outcome)
      
      elo_ratings[home_team] = new_home_elo
      elo_ratings[away_team] = new_away_elo
      
      gamesPlayed[home_team] += 1
      gamesPlayed[away_team] += 1


      # Append game data as a dictionary
      games.append({
        'SEASON': current_season,
        'DATE': row['GAME_DATE'].split("T")[0],  # Extract date from datetime
        'Home_Team': home_team,
        'Away_Team': away_team,
        'HT_PTS': home_score, # HT -- home team points
        'AT_PTS': away_score, # AT -- away team points
        'OUTCOME': outcome, # 1 for home win, 0 for away win
        'HT_ELO' : round(new_home_elo, 2),
        'AT_ELO' : round(new_away_elo, 2),
        'K_HOME_USED': round(K_home, 2),
        'K_AWAY_USED': round(K_away, 2),
      })

    elo_df = pd.DataFrame(list(elo_ratings.items()), columns=['Team', 'Internal_Elo'])
    # Shift up by +1000 so no published Elo ever goes below ~800
    elo_df['Elo_Rating'] = elo_df['Internal_Elo'] + 1000
    elo_df = elo_df.sort_values(by='Team', ascending=True).reset_index(drop=True)
    elo_df[['Team', 'Elo_Rating']].to_csv("elo_ratings.csv", index=False)
    
    games_df = pd.DataFrame(games)  # Convert list of dictionaries to DataFrame
    games_df.to_csv("elo_games.csv", index=False)
    print("Elo ratings saved to elo_ratings.csv")

analyze_elo()