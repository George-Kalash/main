#!/usr/bin/env python3
"""
process_nba_data.py

A script to load NBA game log CSVs, sort by team and date, compute rolling average features,
and save the processed dataset for modeling.

Usage:
    python process_nba_data.py --input regular_season_totals_2010_2024.csv \
        --output regular_season_processed.csv --window 5

Allows for manual sorting and inspection of the processed file.
"""
import argparse
import pandas as pd

def load_data(path, usecols=None, date_col='GAME_DATE'):
    """Load CSV into DataFrame, parse dates if date_col provided."""
    df = pd.read_csv(path, usecols=usecols, parse_dates=[date_col])
    return df


def sort_data(df, team_col='TEAM_ID', date_col='GAME_DATE'):
    """Sort DataFrame by team and descending date."""
    return df.sort_values([team_col, date_col], ascending=[True, False])


def compute_rolling_features(df, stats, team_col='TEAM_ID', window=5):
    """Compute rolling averages for stats per team over the specified window."""
    rolling = (
        df.groupby(team_col)[stats]
          .rolling(window=window, min_periods=1)
          .mean()
          .reset_index(level=0, drop=True)
          .add_suffix('_avg')
    )
    return pd.concat([df.reset_index(drop=True), rolling.reset_index(drop=True)], axis=1)


def main():
    parser = argparse.ArgumentParser(description="Process NBA game logs.")
    parser.add_argument('--input', '-i', required=True,
                        help='Path to input CSV file')
    parser.add_argument('--output', '-o', required=True,
                        help='Path to save processed CSV')
    parser.add_argument('--window', '-w', type=int, default=5,
                        help='Rolling window size (number of games)')
    parser.add_argument('--stats', nargs='+', default=['PTS','REB','AST','STL','BLK'],
                        help='List of stat columns to compute rolling averages')
    parser.add_argument('--team-col', default='TEAM_ID',
                        help='Column name for team identifier')
    parser.add_argument('--date-col', default='GAME_DATE',
                        help='Column name for game date')
    parser.add_argument('--wl-col', default='WL',
                        help='Column name for win/loss flag')
    parser.add_argument('--usecols', nargs='+',
                        help='Subset of columns to read from CSV')

    args = parser.parse_args()

    # Load and optionally subset
    df = load_data(args.input, usecols=args.usecols, date_col=args.date_col)
    print(f"Loaded {len(df)} rows from {args.input}")

    # Sort data
    df_sorted = sort_data(df, team_col=args.team_col, date_col=args.date_col)
    print("Data sorted by team and date.")

    # Compute rolling features
    df_features = compute_rolling_features(
        df_sorted,
        stats=args.stats,
        team_col=args.team_col,
        window=args.window
    )
    print(f"Computed rolling averages with window={args.window}: {', '.join([s+'_avg' for s in args.stats])}")

    # Save processed CSV
    df_features.to_csv(args.output, index=False)
    print(f"Processed data saved to {args.output}")

if __name__ == '__main__':
    main()
