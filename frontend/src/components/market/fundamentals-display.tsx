import { TickerFundamentalData } from "@/types/market";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Building2, BarChart3, PieChart, Percent } from "lucide-react";

// Helper to format large numbers
function formatNumber(value: number | null): string {
    if (value === null || value === undefined) return "N/A";

    if (Math.abs(value) >= 1e12) {
        return `$${(value / 1e12).toFixed(2)}T`;
    } else if (Math.abs(value) >= 1e9) {
        return `$${(value / 1e9).toFixed(2)}B`;
    } else if (Math.abs(value) >= 1e6) {
        return `$${(value / 1e6).toFixed(2)}M`;
    } else if (Math.abs(value) >= 1e3) {
        return `$${(value / 1e3).toFixed(2)}K`;
    }
    return value.toLocaleString();
}

// Helper to format percentages
function formatPercent(value: number | null): string {
    if (value === null || value === undefined) return "N/A";
    return `${(value * 100).toFixed(2)}%`;
}

// Helper to format decimals
function formatDecimal(value: number | null, decimals: number = 2): string {
    if (value === null || value === undefined) return "N/A";
    return value.toFixed(decimals);
}

const DataRow = ({
                     label,
                     value,
                 }: {
    label: string;
    value: string;
}) => (
    <div className="flex justify-between py-2.5 border-b border-border last:border-0">
        <span className="text-muted-foreground text-sm">{label}</span>
        <span className="font-medium text-sm">{value}</span>
    </div>
);

export default function FundamentalsDisplay({
                                                data,
                                            }: {
    data: TickerFundamentalData;
}) {
    return (
        <div className="space-y-6">
            {/* Company Info Card */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-primary" />
                        About {data.companyName}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {data.sector && (
                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
                {data.sector}
              </span>
                        )}
                        {data.industry && (
                            <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-medium">
                {data.industry}
              </span>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {data.longBusinessSummary || "No description available."}
                    </p>
                </CardContent>
            </Card>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Market Data Card */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-primary">
                            <BarChart3 className="h-4 w-4" />
                            Market Data
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <DataRow
                            label="52 Week High"
                            value={formatDecimal(data.marketData["52 Week High"])}
                        />
                        <DataRow
                            label="52 Week Low"
                            value={formatDecimal(data.marketData["52 Week Low"])}
                        />
                        <DataRow
                            label="Beta"
                            value={formatDecimal(data.marketData["Beta"])}
                        />
                    </CardContent>
                </Card>

                {/* Valuation Card */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-primary">
                            <PieChart className="h-4 w-4" />
                            Valuation
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <DataRow
                            label="P/E (LTM)"
                            value={formatDecimal(data.valuation["LTM P/E"])}
                        />
                        <DataRow
                            label="P/E (NTM)"
                            value={formatDecimal(data.valuation["NTM P/E"])}
                        />
                        <DataRow
                            label="Target Price"
                            value={data.valuation["Street Target Price"]
                                ? `$${formatDecimal(data.valuation["Street Target Price"])}`
                                : "N/A"}
                        />
                        <DataRow
                            label="Dividend Yield"
                            value={formatPercent(data.valuation["Dividend Yield"])}
                        />
                    </CardContent>
                </Card>

                {/* Capital Structure Card */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-primary">
                            <DollarSign className="h-4 w-4" />
                            Capital Structure
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <DataRow
                            label="Market Cap"
                            value={formatNumber(data.capitalStructure["Market Cap"])}
                        />
                        <DataRow
                            label="Enterprise Value"
                            value={formatNumber(data.capitalStructure["Enterprise Value"])}
                        />
                        <DataRow
                            label="Net Debt"
                            value={formatNumber(data.capitalStructure["LTM Net Debt"])}
                        />
                        <DataRow
                            label="Net Debt/EBITDA"
                            value={formatDecimal(data.capitalStructure["LTM Net Debt/EBITDA"])}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}