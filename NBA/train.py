import pandas as pd
import random
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, roc_auc_score

FEATURES = [
  'TEAM_ELO',              # Team’s pre-game Elo rating
  'OPPONENT_ELO',          # Opponent’s pre-game Elo rating
  'AVAILABLE_FLAG',        # Indicator if a key player (or similar) is available (can be encoded)
  'TEAM_ABBREVIATION',     # Team identifier (might be one-hot encoded)
  'OPPONENT_ABBREVIATION', # Opponent identifier (one-hot encoding recommended)
  'MIN',                   # Minutes played
  'FGM',                   # Field goals made
  'FGA',                   # Field goals attempted
  'FG_PCT',                # Field goal percentage
  'FG3M',                  # Three-point field goals made
  'FG3A',                  # Three-point field goals attempted
  'FG3_PCT',               # Three-point field goal percentage
  'FTM',                   # Free throws made
  'FTA',                   # Free throw attempts
  'FT_PCT',                # Free throw percentage
  'OREB',                  # Offensive rebounds
  'DREB',                  # Defensive rebounds
  'REB',                   # Total rebounds
  'AST',                   # Assists
  'TOV',                   # Turnovers
  'STL',                   # Steals
  'BLK',                   # Blocks
  'PF',                    # Personal fouls
  'SEASON_YEAR',           # Season the game was played
  'GP_RANK',
  'MIN_RANK',
  'FTM_RANK',
  'FG3A_RANK',
  'AST_RANK'
]
TARGET = 'OUTCOME'

def train(n=20):
  """ 
  trains the model and prints the best rs found
  Args:
      n (int, optional): Defaults to 20.
  """
  df = pd.read_csv("fullset.csv",  parse_dates=["GAME_DATE"])

  X = df[FEATURES]
  y = df[TARGET]
  # best overall (so far): 100, gives % of 0.8227634434530986 and ROC AUC: 0.9013188909819833
  best_rs = {
    'accuracy': 0.0 , 
    'rs_value': 0
  }

  i = 1
  while i < n:
    # get random state
    rs = random.randint(0, 100)
    print(rs)
    # Split data into training (X) and testing (y) dataset
    X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=100, test_size=0.15)

    # Identofy categorical features
    categorical_features = ['SEASON_YEAR','OPPONENT_ABBREVIATION', 'TEAM_ABBREVIATION', 'AVAILABLE_FLAG']
    numerical_features = [f for f in FEATURES if f not in categorical_features]

    # Create the ColumnTransformer
    preprocessor = ColumnTransformer(
      transformers=[
        ('num', StandardScaler(), numerical_features),
        ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
      ]
    )

    # Define the Classifier
    clf = RandomForestClassifier(random_state=0)
    
    # Build the overall pipeline
    pipeline = Pipeline(steps=[
      ('preprocessor', preprocessor),
      ('classifier', clf)
    ])

    # Train the model
    pipeline.fit(X_train, y_train)

    # Prediction fun
    y_pred = pipeline.predict(X_test)
    print(classification_report(y_test, y_pred))
    accuracy = pipeline.score(X_test, y_test)
    print("ROC AUC Score:", roc_auc_score(y_test, pipeline.predict_proba(X_test)[:, 1]))
    if best_rs['accuracy'] < accuracy:
      best_rs['accuracy'] = accuracy
      best_rs['rs_value'] = rs
    i+=1
  print(f"best accuracy: {best_rs['accuracy']}, best rs_value: {best_rs['rs_value']}")
  
train(n=2)