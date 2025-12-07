import yfinance as yf
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field #tools to create a strict template for the JSON data
from typing import Optional, Any #typing helpers . Optional means it can be the var specified or zero. 

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

        if not info or info.get('quoteType') == 'NONE' or not info.get('marketCap'):
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
        symbol = yf.Ticker(ticker)
        new_early_date = earliest_date - 2592000 # ~1 month in epoch time
        data = symbol.history(start=new_early_date, end=earliest_date, interval='1d') # end is not inclusive
        if data.empty:
            raise HTTPException(status_code=404, detail=f"data for {ticker} is not found, is empty, or no data available.")

        return change_labels(data)
        
    
    except HTTPException as e:
        # Re-raise HTTP exceptions directly
        raise e
    except Exception as e:
        # Catch any other unexpected errors
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")
    