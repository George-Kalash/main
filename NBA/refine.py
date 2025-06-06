# refine.py
import pandas as pd
import re

__all__ = ["refine_data"]

def refine_data(
    df_or_frames,
    matchup_col: str = "MATCHUP",
    team_col: str = "TEAM_ABBREVIATION",   # nba_api’s name
) -> pd.DataFrame:
    """
    • Accepts either a single DataFrame or a list/tuple of DataFrames.
    • Splits MATCHUP into HOME_AWAY (@ / vs) and OPPONENT_ABBREVIATION.
    """

    # ── 1. If we got a list, drop empties and concatenate ────────────────────
    if isinstance(df_or_frames, (list, tuple)):
        frames = [f for f in df_or_frames if not f.empty]
        if not frames:
            raise ValueError("No non-empty frames supplied to refine_data()")
        df = pd.concat(frames, ignore_index=True)
    else:
        df = df_or_frames

    # ── 2. Sanity check ──────────────────────────────────────────────────────
    if matchup_col not in df.columns:
        raise KeyError(
            f"Column '{matchup_col}' not found. Available columns: {list(df.columns)}"
        )

    # ── 3. Extract separator + opponent ─────────────────────────────────────
    pattern = (
        r"^[A-Z]{2,4}\s+"             # skip the first team code
        r"(?P<HOME_AWAY>@|vs\.?)"     # capture @ or vs / vs.
        r"\s+"
        r"(?P<OPPONENT_ABBREVIATION>[A-Z]{2,4})"
        r"\s*$"
    )

    extracted = df[matchup_col].str.extract(pattern, expand=True)
    extracted["HOME_AWAY"] = extracted["HOME_AWAY"].str.replace(r"\.", "", regex=True)
    

    # ── 4. Join and, *now* that we’re done, optionally drop MATCHUP ─────────
    df.insert(3, "HOME_AWAY",extracted["HOME_AWAY"])
    df.insert(4, "OPPONENT_ABBREVIATION",extracted["OPPONENT_ABBREVIATION"])
    df = df.rename(columns={"WL": "OUTCOME"})

    repleceCol = df.pop("OUTCOME")  # move OUTCOME to the end
    df.insert(len(df.columns), "OUTCOME", repleceCol)
    

    # comment this line out if you still want MATCHUP around
    df = df.drop(columns=[matchup_col])
    mask = df['HOME_AWAY'].str.contains('@', na=False)
    df = df[~mask].reset_index(drop=True)

    return df

def get_win_loss_ratio(cutoff="2002-03"):
    """
    Args:
        cutoff (str): cutoff season (must be < lastes season)
    Returns:
        DataFrame: Wins ara losses of the team up to a given season, 1996-1997 by default.
    """
    file = pd.read_csv("fullSet.csv")
    additional_stats_df = pd.read_csv("elo_ratings.csv")
    
    team_record = {}
    
    for _, row in file.iterrows():
        
        
        if row['SEASON_YEAR'] == cutoff:
            break
        home_team = row['TEAM_ABBREVIATION']
        away_team = row['OPPONENT_ABBREVIATION']
        outcome = row['OUTCOME']
        
        if home_team not in team_record:
            team_record[home_team] = {"wins" : 0, "losses": 0}
        if away_team not in team_record:
            team_record[away_team] = {'wins': 0, 'losses': 0}

        if outcome == 'W':
            team_record[home_team]['wins'] += 1
            team_record[away_team]['wins'] += 1
            
        else:
            team_record[home_team]['losses'] += 1
            team_record[away_team]['losses'] += 1
        
    df = pd.DataFrame.from_dict(team_record, orient='index')
    
    
    df = df.reset_index().rename(columns={'index': 'Team'})
    df['W/L'] = df['wins'] / df['losses']
    df = df[['Team', 'wins', 'losses', 'W/L']]
    df = df.sort_values(by='Team', ascending=True)
    
    df_joint = pd.merge(additional_stats_df, df, how="inner", on='Team')
    
    df_joint.to_csv("win-loss-total_elo.csv", index=False)
    print("Finished W/L parcing")
    return df_joint
    
# get_win_loss_ratio()