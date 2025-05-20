import pandas as pd
from nba_api.stats.static import teams
team_meta = teams.get_teams()
teams_df = pd.DataFrame(team_meta)

