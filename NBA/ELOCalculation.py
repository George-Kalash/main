import pandas

def win_probability(rating1, rating2):
    return 1 / (1 + (10 ** ((rating1 - rating2) / 350))) # <- fix the overflow issue

def elo_rating(Ra=1200, Rb=1200, k=30, outcome=1):
    Pa = win_probability(Ra, Rb)
    Pb = win_probability(Rb, Ra)
    
    Ra += k * (outcome - Pa)
    Rb += k * ((1 - outcome) - Pb)

    # print(f"Updated Ratings: Ra = {Ra}, Rb = {Rb}")
    return Ra, Rb
  
def analyze_elo(csv_file="nba_games_1996_2025.csv"):
    """
    Analyze Elo ratings for NBA teams based on game resuts.
    Args:
        csv_file (str, optional): _description_. Defaults to "nba_games_1996_2025.csv".
    """

    df = pandas.read_csv(csv_file)
    elo_ratings = {}
    games = []  # Use a list to store game dictionaries
    current_season = None  # e.g., use year extracted from row['GAME_DATE']
    
    for index, row in df.iterrows():
      if row['HOME_AWAY'] != "vs":
        continue
      season = row['GAME_DATE'].split('-')[0]  # example: use year from date
      if current_season is None:
        current_season = season
      elif season != current_season:
        # Optional: reset ratings or regress toward baseline for a new season
        for team in elo_ratings:
            elo_ratings[team] = 1200  # or apply a regression factor
        current_season = season
      
      home_team = row['TEAM_ABBREVIATION'] if row['HOME_AWAY'] == 'vs' else row['OPPONENT_ABBREVIATION']
      away_team = row['OPPONENT_ABBREVIATION'] if row['HOME_AWAY'] == 'vs' else row['TEAM_ABBREVIATION']
      home_score = row['PTS'] if row['HOME_AWAY'] == 'vs' else row['PTS'] - row['PLUS_MINUS']
      away_score = row['PTS'] - row['PLUS_MINUS'] if row['HOME_AWAY'] == 'vs' else row['PTS']
      # Initialize ratings if teams are not already in the dictionary
      if home_team not in elo_ratings:
        elo_ratings[home_team] = 1200
      if away_team not in elo_ratings:
        elo_ratings[away_team] = 1200
      # Determine outcome: 1 for home win, 0 for away win
      outcome = 1 if row['OUTCOME'] == 'W' else 0
      
      # Update Elo ratings based on the game result
      elo1, elo2 = elo_rating(elo_ratings[home_team], elo_ratings[away_team], 30, outcome)
      elo_ratings[home_team] = elo1
      elo_ratings[away_team] = elo2

      # Append game data as a dictionary
      games.append({
        'DATE': row['GAME_DATE'].split("T")[0],  # Extract date from datetime
        'HT': home_team,
        '@': row['HOME_AWAY'],
        'AT': away_team,
        'HT_PTS': home_score,
        'AT_PTS': away_score,
        'OUTCOME': outcome,
        'TEAM1_ELO' : round(elo1, 2),
        'TEAM2_ELO' : round(elo2, 2)
      })

    elo_df = pandas.DataFrame(list(elo_ratings.items()), columns=['Team', 'Elo_Rating'])
    elo_df = elo_df.sort_values(by='Elo_Rating', ascending=False).reset_index(drop=True)
    elo_df.to_csv("elo_ratings.csv", index=False)
    
    games_df = pandas.DataFrame(games)  # Convert list of dictionaries to DataFrame
    games_df.to_csv("elo_games.csv", index=False)
    print("Elo ratings saved to elo_ratings.csv")




analyze_elo()







# Initialize EloGame with default parameters
# game = EloGame(re=1400, rd=350, k=20) 
                # re: initial rating for each player/team
                # rd: initial rating deviation (uncertainty in the rating)
                # k: weight of the game in the rating update 

# def calculate_elo(csv_file="nba_games_1996_2025.csv"):
#   """
#   Calculate Elo ratings for NBA teams based on game results.
#   Returns:
#       pandas.DataFrame: DataFrame containing team names and their Elo ratings.
#   """
#   #Load the dataset
#   df = pandas.read_csv(csv_file)
#   # Initialize a dictionary to store Elo ratings
#   elo_ratings = {}
  
#   # Iterate through each row in the DataFrame
#   for index, row in df.iterrows():
#       # Determine home team based on HOME_AWAY
#       home_team = row['TEAM_ABBREVIATION'] if row['HOME_AWAY'] == 'vs' else row['OPPONENT_ABBREVIATION'] 
#       away_team = row['OPPONENT_ABBREVIATION'] if row['HOME_AWAY'] == 'vs' else row['TEAM_ABBREVIATION']
#       home_score = row['PTS'] if row['HOME_AWAY'] == 'vs' else row['OPPONENT_PTS']
#       away_score = row['OPPONENT_PTS'] if row['HOME_AWAY'] == 'vs' else row['PTS']
#       # Initialize ratings if teams are not already in the dictionary
#       if home_team not in elo_ratings:
#           elo_ratings[home_team] = game.re
#           if away_team not in elo_ratings:
#               elo_ratings[away_team] = game.re
#       # Update Elo ratings based on the game result        
#       game.update_elo(home_team, away_team, home_score, away_score)
#   # Create a DataFrame from the Elo ratings dictionary
#   elo_df = pandas.DataFrame(list(elo_ratings.items()), columns=['Team', 'Elo_Rating']) 
#   # Sort the DataFrame by Elo rating in descending order
#   elo_df = elo_df.sort_values(by='Elo_Rating', accending=False).reset_index(drop=True)
#   return elo_df

# def save_elo_ratings():
#     """
#     Saves the calculated Elo ratings to a CSV file.
#     """
#     elo_df = calculate_elo()
#     elo_df.to_csv("elo_ratings.csv", index=False)
#     print("Elo ratings saved to elo_ratings.csv")
    
# if __name__ == "__main__":
#     save_elo_ratings()
#     print("Elo ratings calculation completed.")

# save_elo_ratings()


