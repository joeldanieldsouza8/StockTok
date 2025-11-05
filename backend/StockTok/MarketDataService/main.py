import yfinance as yf
from fastapi import FastAPI

app = FastAPI()

@app.get("/api/market/ticker/{ticker}/")
async def ticker_detail(ticker: str):
    print(f"Looking up: {ticker}")
    data = yf.Ticker(ticker)
    info = {"info": data.info}
    return info
    