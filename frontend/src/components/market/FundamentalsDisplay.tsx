//This component fetch then displays fundamental data for a given stock ticker.

import { TickerFundamentalData } from "src/types/market";

// A small helper component for a single row of data
const DataRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number | null;
}) => (
  <div className="flex justify-between py-2 border-b border-gray-700">
    <span className="text-gray-400 text-sm">{label}</span>
    <span className="font-semibold text-sm text-white">
      {value !== null ? value.toLocaleString() : "N/A"}
    </span>
  </div>
);

export default function FundamentalsDisplay({
  data,
}: {
  data: TickerFundamentalData;
}) {
  return (
    <div className="space-y-6">
      <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
        <h2 className="text-xl font-bold mb-2 text-white">
          {data.companyName}
        </h2>
        <div className="flex gap-2 text-xs text-gray-400 mb-4">
          <span className="bg-gray-800 px-2 py-1 rounded">{data.sector}</span>
          <span className="bg-gray-800 px-2 py-1 rounded">{data.industry}</span>
        </div>
        <p className="text-sm text-gray-300 line-clamp-3">
          {data.longBusinessSummary}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Market Data Card */}
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
          <h3 className="text-orange-500 font-bold mb-3 uppercase text-xs tracking-wider">
            Market Data
          </h3>
          <DataRow
            label="52 Week High"
            value={data.marketData["52 Week High"]}
          />
          <DataRow label="52 Week Low" value={data.marketData["52 Week Low"]} />
          <DataRow label="Beta" value={data.marketData["Beta"]} />
        </div>

        {/* Valuation Card */}
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
          <h3 className="text-orange-500 font-bold mb-3 uppercase text-xs tracking-wider">
            Valuation
          </h3>
          <DataRow label="P/E (LTM)" value={data.valuation["LTM P/E"]} />
          <DataRow label="P/E (NTM)" value={data.valuation["NTM P/E"]} />
          <DataRow
            label="Target Price"
            value={data.valuation["Street Target Price"]}
          />
        </div>

        {/* Capital Structure Card */}
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
          <h3 className="text-orange-500 font-bold mb-3 uppercase text-xs tracking-wider">
            Capital Structure
          </h3>
          <DataRow
            label="Market Cap"
            value={data.capitalStructure["Market Cap"]}
          />
          <DataRow
            label="Enterprise Value"
            value={data.capitalStructure["Enterprise Value"]}
          />
          <DataRow
            label="Net Debt"
            value={data.capitalStructure["LTM Net Debt"]}
          />
        </div>
      </div>
    </div>
  );
}
