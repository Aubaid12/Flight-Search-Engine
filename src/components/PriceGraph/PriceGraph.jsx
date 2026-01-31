import { useMemo } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import './PriceGraph.css';

export function PriceGraph({ flights, filteredFlights }) {
    const { chartData, stats, priceDistribution } = useMemo(() => {
        if (!flights.length) {
            return { chartData: [], stats: null, priceDistribution: [] };
        }

        const prices = flights.map(f => f.price.total);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        const bucketCount = 12;
        const bucketSize = (maxPrice - minPrice) / bucketCount || 1;

        const distribution = Array.from({ length: bucketCount }, (_, i) => {
            const rangeStart = minPrice + i * bucketSize;
            const rangeEnd = rangeStart + bucketSize;

            const allCount = flights.filter(
                f => f.price.total >= rangeStart && f.price.total < rangeEnd
            ).length;

            const filteredCount = filteredFlights.filter(
                f => f.price.total >= rangeStart && f.price.total < rangeEnd
            ).length;

            return {
                price: `$${Math.round(rangeStart)}`,
                priceValue: Math.round(rangeStart),
                all: allCount,
                filtered: filteredCount,
            };
        });

        const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
        const filteredPrices = filteredFlights.map(f => f.price.total);
        const filteredAvg = filteredPrices.length
            ? filteredPrices.reduce((a, b) => a + b, 0) / filteredPrices.length
            : 0;

        return {
            chartData: distribution,
            stats: {
                min: minPrice,
                max: maxPrice,
                avg: avgPrice,
                filteredMin: filteredPrices.length ? Math.min(...filteredPrices) : 0,
                filteredAvg,
                total: flights.length,
                filtered: filteredFlights.length,
            },
            priceDistribution: distribution,
        };
    }, [flights, filteredFlights]);

    if (!flights.length) {
        return null;
    }

    return (
        <div className="price-graph">
            <div className="graph-header">
                <div className="graph-title">
                    <TrendingUp size={20} />
                    <span>Price Distribution</span>
                </div>
                {stats && (
                    <div className="graph-stats">
                        <div className="stat">
                            <span className="stat-label">Lowest</span>
                            <span className="stat-value">${stats.filteredMin || stats.min}</span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">Average</span>
                            <span className="stat-value">${Math.round(stats.filteredAvg || stats.avg)}</span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">Showing</span>
                            <span className="stat-value">{stats.filtered} of {stats.total}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="graph-container">
                <ResponsiveContainer width="100%" height={180}>
                    <AreaChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorAll" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#334155" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#334155" stopOpacity={0.1} />
                            </linearGradient>
                            <linearGradient id="colorFiltered" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(148, 163, 184, 0.1)"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="price"
                            tick={{ fill: '#94a3b8', fontSize: 11 }}
                            tickLine={false}
                            axisLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
                            interval="preserveStartEnd"
                        />
                        <YAxis
                            tick={{ fill: '#94a3b8', fontSize: 11 }}
                            tickLine={false}
                            axisLine={false}
                            width={30}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="all"
                            stroke="#475569"
                            fillOpacity={1}
                            fill="url(#colorAll)"
                            strokeWidth={1}
                            name="All flights"
                        />
                        <Area
                            type="monotone"
                            dataKey="filtered"
                            stroke="#6366f1"
                            fillOpacity={1}
                            fill="url(#colorFiltered)"
                            strokeWidth={2}
                            name="Filtered"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="graph-legend">
                <div className="legend-item">
                    <span className="legend-dot all" />
                    <span>All flights</span>
                </div>
                <div className="legend-item">
                    <span className="legend-dot filtered" />
                    <span>Matching filters</span>
                </div>
            </div>
        </div>
    );
}

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload || !payload.length) {
        return null;
    }

    return (
        <div className="graph-tooltip">
            <p className="tooltip-label">{label}</p>
            {payload.map((entry, index) => (
                <p key={index} className="tooltip-value" style={{ color: entry.stroke }}>
                    {entry.name}: {entry.value} flight{entry.value !== 1 ? 's' : ''}
                </p>
            ))}
        </div>
    );
}
