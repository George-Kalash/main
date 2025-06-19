import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, roc_auc_score

FEATURES = [
  'TEAM_ELO','OPPONENT_ELO',
  'AVAILABLE_FLAG','TEAM_ABBREVIATION',
  'FG_PCT','REB','AST','TOV',
  'OPPONENT_ABBREVIATION'
]
TARGET = 'OUTCOME'


df = pd.read_csv("fullset.csv",  parse_dates=["GAME_DATE"])

X = df[FEATURES]
y = df[TARGET]

# Split data into training (X) and testing (y) dataset
X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=42, test_size=0.2)

# Identofy categorical features
categorical_features = ['OPPONENT_ABBREVIATION', 'TEAM_ABBREVIATION', 'AVAILABLE_FLAG']
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
print("ROC AUC Score:", roc_auc_score(y_test, pipeline.predict_proba(X_test)[:, 1]))