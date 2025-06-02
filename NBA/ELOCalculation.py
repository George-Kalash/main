import pandas
from elo_rating import EloGame

# Initialize EloGame with default parameters
game = EloGame(re=1400, rd=350, k=20) 
                # re: initial rating for each player/team
                # rd: initial rating deviation (uncertainty in the rating)
                # k: weight of the game in the rating update 

def calculate_elo_():
  """
  Calculate Elo ratings for NBA teams based on game results.
  Returns:
      pandas.DataFrame: DataFrame containing team names and their Elo ratings.
  """
  #Load the dataset
  df = pandas.read_csv("nba_games_1996_2025.csv")
  # Initialize a dictionary to store Elo ratings
  elo_ratings = {}
  
  # Iterate through each row in the DataFrame
  for index, row in df.iterrows():
      # Determine home team based on HOME_AWAY
      home_team = row['TEAM_ABBREVIATION'] if row['HOME_AWAY'] == 'vs' else row['OPPONENT_ABBREVIATION'] 
      away_team = row['OPPONENT_ABBREVIATION'] if row['HOME_AWAY'] == 'vs' else row['TEAM_ABBREVIATION']
      home_score = row['PTS'] if row['HOME_AWAY'] == 'vs' else row['OPPONENT_PTS']
      
  return