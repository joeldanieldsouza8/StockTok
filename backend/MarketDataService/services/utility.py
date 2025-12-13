import pandas as pd
import json

'''
1. Renames the columns of the yfinance dataframe to make it suitable 
   for lightweight charts to parse.
   
2. Returns a list of dictionaries for each bar
   -> each dictionary represents a json object
   -> keys: str
   -> values: float/int
   
3. Dictionary Example:
   {'open': 185.5,
    'high': 187.2299957275,
    'low': 183.3300018311,
    'close': 185.5399932861,
    'time': 1759723200}
''' 
def change_labels(yfinance_df: pd.DataFrame) -> list:
    new_frame = yfinance_df.reset_index().rename(columns={
        'Date': 'time',
        'Open': 'open',
        'High': 'high',
        'Low': 'low',
        'Close': 'close'
    })[['open', 'high', 'low', 'close', 'time']]
    
    new_frame_json_string = new_frame.to_json(orient='records', date_unit='s')
    new_frame_json_obj = json.loads(new_frame_json_string)
    return new_frame_json_obj

