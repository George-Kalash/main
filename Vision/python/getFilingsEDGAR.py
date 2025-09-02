import os, requests
import time
from datetime import date
from pandas import *
import pandas as pd
from edgar import Company
from edgar import *  
set_identity("scccbf@gmail.com") 
print("EdgarTools installed successfully!")

from edgar.entity import public_companies

# ADGENDA:
# 0. organize files by type <- DONE
# 1. create method to retrieve specific financial data get_latest_financial_data(ticker="AAPL", statement_type="10-K") -> pd.DataFrame ie net income, stockholder equity ...
# 1.2. Extract relevant data from the income statement, balance sheet, cash flow statements.

co = Company("NVDA")
fin = co.get_financials()

df = fin.income_statement().to_dataframe()
bs = fin.balance_sheet().to_dataframe()
print(bs)
if not df.empty:
    # Use the 'concept' column for a more reliable match
    row = df[df["concept"] == "us-gaap_NetIncomeLoss"]
    row2 = bs[bs["concept"] == "us-gaap_StockholdersEquity"]
    print(row2)
    if not row.empty:
        # latest period is typically the last column
        net_income = row.iloc[0, 2]
        stockholder_equity = row2.iloc[0, 2]
        print(f"Net Income: {net_income}")
        print(f"Stockholder Equity: {stockholder_equity}")
    else:
        print("Net income not found in the income statement.")
        # If you want to see the whole dataframe when net income is not found
        # print(df)
else:
    print("Failed to retrieve income statement. The DataFrame is empty.")

# print(dir(income_statement))
# print(vars(Company))
# print(co.industry)
# [ 'balance_sheet', 'business_address', 'cash_flow', 'cik', 'data', 'display_name', 
#  'facts', 'fiscal_year_end', 'get_exchanges', 'get_facts', 'get_filings', 'get_financials', 'get_icon', 'get_quarterly_financials', 'get_structured_statement', 
#  'get_ticker', 'income_statement', 'industry', 'is_company', 'is_individual', 'latest', 'latest_tenk', 'latest_tenq', 'mailing_address', 'name', 'not_found', 
#  'public_float', 'shares_outstanding', 'sic', 'tickers']
# print(balance_sheet._calculate_balance_sheet_ratios())
# if __name__ == '__main__':
#     c = Company("NVDA")
#     ticker = c.get_ticker()
#     filings = c.get_filings(form="10-K")
#     ticker = c.tickers
#     print(filings)
#     print(c.data.mailing_address)
#     print(c)
#     print(ticker[0])
# print(f"Revenue: ${revenue:,.0f}, Net Income: ${net_income:,.0f}")
def getCompanyStatement(c="AAPL", IS=True, BS=True, CFS=True): 
    company = Company(c)
    filings = company.get_filings()
    # company_facts = company.get_facts_for_namespace()

    
    # print(filings)


getCompanyStatement()

# financials = company.get_financials()
# filings = get_filings()

# IS = company.income_statement()
# BS = company.balance_sheet()
# # CFS = company.cash_flow_statement()
# if IS and BS is not None:
#     print(IS)
#     print(BS)
#     # print(CFS)
# # print(financials)
# print(f"Shares Outstanding: {232.14*company.shares_outstanding:,.0f}")