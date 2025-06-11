import os
from ELOCalculation import analyze_elo
from refine import get_win_loss_ratio
from getData import get_data

get_data()
analyze_elo()
get_win_loss_ratio()



os.remove("temporary_set.csv")