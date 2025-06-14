import pandas as pd
from sklearn.model_selection import train_test_splits
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, roc_auc_score

FEATURES = [
  'TEAM_ELO','OPPONENT_ELO',
  'HOME_AWAY','AVAILABLE_FLAG',
  'FG_PCT','REB','AST','TOV',
  'PTS','PLUS_MINUS'
]
TARGET = 'OUTCOME'


df = pd.read_csv("fullset.csv",  parse_dates=["GAME_DATE"])

# write the rest