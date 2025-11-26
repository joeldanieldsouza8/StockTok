## Steps for market-service
1. cd to backend/StockTok/MarketDataService
2. Create and activate a virtual environment to use for project
~~~
1. python -m venv venv
2. source venv/bin/activate -> for MacOS/Linux
   venv\Scripts\activate.bat -> Windows
 ~~~
 
3. Install the packages with requirements.txt file
~~~
pip install -r requirements.txt
~~~
4. Run FastAPI server
~~~
python -m fastapi dev main.py
~~~
5. Go to URL to verify that ticker info is being sent from yfinance properly
~~~
http://127.0.0.1:8000/api/market/ticker/NVDA/
~~~
6. Check out the docs version to play around with different tickers
~~~
http://127.0.0.1:8000/docs/
~~~