// This code does the work of the pydentic models in Python to define the structure of market-related data.

// Matches Python 'MarketData'
export interface MarketData {
  "52 Week High": number | null;
  "52 Week Low": number | null;
  "Avg. 3 Month Volume": number | null;
  "Beta": number | null;
}

// Matches Python 'CapitalStructure'
export interface CapitalStructure {
  "Market Cap": number | null;
  "Enterprise Value": number | null;
  "LTM Net Debt": number | null;
  "LTM Net Debt/EBITDA": number | null;
}

// Matches Python 'Valuation'
export interface Valuation {
  "Street Target Price": number | null;
  "NTM P/E": number | null;
  "LTM P/E": number | null;
  "LTM P/B": number | null;
  "Dividend Yield": number | null;
}

// The Main Object
export interface TickerFundamentalData {
  companyName: string | null;
  longBusinessSummary: string | null;
  sector: string | null;
  industry: string | null;
  marketData: MarketData;
  capitalStructure: CapitalStructure;
  valuation: Valuation;
  // Add efficiency and growth here if you want
}

export interface OHLCPoint {
  time: string; // YYYY-MM-DD
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}