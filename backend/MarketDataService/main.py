import yfinance as yf
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field #tools to create a strict template for the JSON data
from typing import Optional, Any #typing helpers . Optional means it can be the var specified or zero. 
from datetime import datetime, timezone

from services.utility import change_labels

app = FastAPI()

#1.Pydantic models : 
#To ensure the data is clean for the fundamentlas endpoint

class MarketData(BaseModel):
    fiftyTwoWeekHigh: Optional[float] = Field(None, alias="52 Week High")
    fiftyTwoWeekLow: Optional[float] = Field(None, alias="52 Week Low")
    avgVolume3Month: Optional[int] = Field(None, alias="Avg. 3 Month Volume")
    beta: Optional[float] = Field(None, alias="Beta")

class CapitalStructure(BaseModel):
    marketCap: Optional[int] = Field(None, alias="Market Cap")
    enterpriseValue: Optional[int] = Field(None, alias="Enterprise Value")
    netDebt: Optional[int] = Field(None, alias="LTM Net Debt")
    netDebtToEbitda: Optional[float] = Field(None, alias="LTM Net Debt/EBITDA")

class Efficiency(BaseModel):
    ltmGrossMargin: Optional[float] = Field(None, alias="LTM Gross Margin")
    ltmEbitMargin: Optional[float] = Field(None, alias="LTM EBIT Margin")
    ltmRoe: Optional[float] = Field(None, alias="LTM ROE")

class Growth(BaseModel): 
    ltmRevenueGrowth: Optional[float] = Field(None, alias="LTM Rev. Growth")
    ltmEpsGrowth: Optional[float] = Field(None, alias="LTM EPS Growth")

class Valuation(BaseModel):
    targetMeanPrice: Optional[float] = Field(None, alias="Street Target Price")
    forwardPE: Optional[float] = Field(None, alias="NTM P/E")
    trailingPE: Optional[float] = Field(None, alias="LTM P/E")
    priceToBook: Optional[float] = Field(None, alias="LTM P/B")
    dividendYield: Optional[float] = Field(None, alias="Dividend Yield")

# This class defines the exact final structure of the JSON that will be sent to the frontend.
class TickerFundamentalData(BaseModel):
    companyName: Optional[str]

    marketData: MarketData
    capitalStructure: CapitalStructure
    valuation: Valuation
    efficiency: Efficiency
    growth: Growth
    longBusinessSummary: Optional[str]
    sector: Optional[str]
    industry: Optional[str]
    trailingAnnualDividendRate: Optional[float]
    exDividendDate: Optional[int] # This is a timestamp

#Helper function ot safely get data from info dict 
def get_safe(data: dict, key: str) -> Optional[Any]:
    return data.get(key)

# 2.The API Endpoints : 

#Endpoint 1: For the fundamental data : 
@app.get("/api/market/ticker/{ticker}/fundamentals", response_model=TickerFundamentalData)
async def get_ticker_fundamentals(ticker: str): 
    """ 
    Fetches fundamental data for the ticker
    """
    
    ticker = ticker.strip().upper()

    print (f"Looking up fundamental data for: {ticker}")
    try : 
        data = yf.Ticker(ticker)
        info = data.info 

        #check if we got data

        if not info or info.get('quoteType') == 'NONE':
            raise HTTPException(status_code=404, detail=f"Ticker '{ticker}' not found or no data available.")

        # For regular stocks, verify they have market data
        # Indices (quoteType='INDEX') won't have marketCap but are still valid
        quote_type = info.get('quoteType', '')
        is_index = quote_type == 'INDEX'

        if not is_index and not info.get('marketCap') and not info.get('regularMarketPrice'):
            raise HTTPException(status_code=404, detail=f"Ticker '{ticker}' not found or no data available.")
 #  Perform  the necessary Calculations 
        net_debt = None
        net_debt_to_ebitda = None
        
        total_debt = get_safe(info, 'totalDebt')
        total_cash = get_safe(info, 'totalCash')
        ebitda = get_safe(info, 'ebitda')

        if total_debt is not None and total_cash is not None:
            net_debt = total_debt - total_cash
            if ebitda is not None and ebitda != 0:
                net_debt_to_ebitda = net_debt / ebitda               

        # Build the clean response object 
        fundamentals = TickerFundamentalData(
            companyName=get_safe(info, 'longName'),
            
            longBusinessSummary=get_safe(info, 'longBusinessSummary'),
            sector=get_safe(info, 'sector'),
            industry=get_safe(info, 'industry'),

            trailingAnnualDividendRate=get_safe(info, 'trailingAnnualDividendRate'),
            exDividendDate=get_safe(info, 'exDividendDate'),
            
            marketData=MarketData(
                **{ 
                    "52 Week High": get_safe(info, 'fiftyTwoWeekHigh'),
                    "52 Week Low": get_safe(info, 'fiftyTwoWeekLow'),
                    "Avg. 3 Month Volume": get_safe(info, 'averageDailyVolume3Month'),
                    "Beta": get_safe(info, 'beta')
                }
            ),

            capitalStructure=CapitalStructure(
                **{
                    "Market Cap": get_safe(info, 'marketCap'),
                    "Enterprise Value": get_safe(info, 'enterpriseValue'),
                    "LTM Net Debt": net_debt,
                    "LTM Net Debt/EBITDA": net_debt_to_ebitda
                }
            ),

            efficiency=Efficiency(
                **{
                    "LTM Gross Margin": get_safe(info, 'grossMargins'),
                    "LTM EBIT Margin": get_safe(info, 'operatingMargins'),
                    "LTM ROE": get_safe(info, 'returnOnEquity')
                }
            ),
            
            growth=Growth(
                **{
                    "LTM Rev. Growth": get_safe(info, 'revenueGrowth'),
                    "LTM EPS Growth": get_safe(info, 'earningsGrowth')
                }
            ),
            
            

            valuation=Valuation(
                **{
                    "Street Target Price": get_safe(info, 'targetMeanPrice'),
                    "NTM P/E": get_safe(info, 'forwardPE'),
                    "LTM P/E": get_safe(info, 'trailingPE'),
                    "LTM P/B": get_safe(info, 'priceToBook'),
                    "Dividend Yield": get_safe(info, 'dividendYield')
                }
            )
        )

        return fundamentals

    except HTTPException as e:
        # Re-raise HTTP exceptions directly
        raise e
    except Exception as e:
        # Catch any other unexpected errors
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")
 
    
# Endpoint 2: Single Ticker price data:
@app.get("/api/market/ticker_price/{ticker}/")
async def ticker_price(ticker: str):
    try:
        print(f"Looking up: {ticker}")
        symbol = yf.Ticker(ticker)
        data = symbol.history(period='1d')
        if not data.empty:
            current_price = data['Close'][0]
            return round(current_price, 2)
        else:
            raise HTTPException(status_code=404, detail=f"Ticker '{ticker}' not found or no data available.")
    except HTTPException as e:
        # Re-raise HTTP exceptions directly
        raise e
    except Exception as e:
        # Catch any other unexpected errors
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")


# Endpoint: Fetch standard history for frontend chart 

@app.get("/api/market/ticker/{ticker}/history/")
async def ticker_history_standard(
    ticker: str, 
    period: str = "1y", 
    interval: str = "1d"
):
    """
    Fetches historical price data for a given stock ticker.
    Used by the frontend StockChart.
    """
    print(f"Looking up historical data for: {ticker}")
    try:
        ticker = ticker.strip().upper()
        stock = yf.Ticker(ticker)
        
        # Fetch history
        hist_data = stock.history(period=period, interval=interval)
        
        if hist_data.empty:
            raise HTTPException(status_code=404, detail=f"No history data found for {ticker}.")
        
        # Convert to list of dictionaries
        hist_data = hist_data.reset_index()
        hist_list = hist_data.to_dict(orient="records")
        
        return {"ticker": ticker, "history": hist_list}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching history: {str(e)}")



# Endpoint 3: return ohlc data in json format after changing labels:
@app.get("/api/market/history/{ticker}/{earliest_date}")
async def ticker_history(ticker: str, earliest_date: int):
    
    try:
        ticker = ticker.strip().upper()
        symbol = yf.Ticker(ticker)
        
        # Convert epoch timestamps to datetime objects
        end_dt = datetime.fromtimestamp(earliest_date, tz=timezone.utc)
        
        # Go back ~3 months (90 days) from the earliest date
        start_epoch = earliest_date - 7776000  # 90 days in seconds
        start_dt = datetime.fromtimestamp(start_epoch, tz=timezone.utc)
        
        print(f"Fetching history for {ticker} from {start_dt} to {end_dt}")
        
        # Fetch history - yfinance accepts datetime objects
        data = symbol.history(start=start_dt, end=end_dt, interval='1d')
        
        if data.empty:
            raise HTTPException(
                status_code=404, 
                detail=f"No historical data found for {ticker} in the requested range."
            )
        
        # Reset index to make Date a column, then convert to records
        data = data.reset_index()
        
        # Format the response - convert Timestamp to ISO string
        result = []
        for _, row in data.iterrows():
            result.append({
                "Date": row['Date'].isoformat() if hasattr(row['Date'], 'isoformat') else str(row['Date']),
                "Open": float(row['Open']) if row['Open'] else None,
                "High": float(row['High']) if row['High'] else None,
                "Low": float(row['Low']) if row['Low'] else None,
                "Close": float(row['Close']) if row['Close'] else None,
                "Volume": int(row['Volume']) if row['Volume'] else None,
            })
        
        return result
        
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Error fetching history: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")
    