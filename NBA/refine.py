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

    return df
