import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib

# Load the fully prepared data
df = pd.read_csv("data/regular_season_elo_processed.csv")

# Features including ELO
features_cols = ['PTS_avg5', 'REB_avg5', 'AST_avg5', 'STL_avg5', 'BLK_avg5', 'TEAM_ELO']
X = df[features_cols]
y = df['WL']

# Split and train
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

rf = RandomForestClassifier(n_estimators=300, random_state=42)
rf.fit(X_train, y_train)

# Evaluate accuracy
y_pred = rf.predict(X_test)
print(f"Model Accuracy with ELO: {accuracy_score(y_test, y_pred):.2%}")

# Save your model
joblib.dump(rf, "data/nba_rf_model.joblib")
