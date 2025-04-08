'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, BarChart, Bar, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { CircleDollarSign, Landmark, Banknote, TrendingUp, TrendingDown, Building2, Calendar, Search } from 'lucide-react';
import { cn } from "@/lib/utils";

// Helper function to format currency (Kenyan Shilling)
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

// Helper function to format percentage
const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('en-KE', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value / 100); // Divide by 100 since the data is likely in decimal form
};

// Helper function to format large numbers
const formatNumber = (value: number) => {
    if (value >= 1000000000) {
        return (value / 1000000000).toFixed(2) + ' Billion';
    } else if (value >= 1000000) {
        return (value / 1000000).toFixed(2) + ' Million';
    } else if (value >= 1000) {
        return (value / 1000).toFixed(2) + ' Thousand';
    } else {
        return value.toFixed(2);
    }
};

// Helper function to format date
const formatDate = (dateString: string) => {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-KE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch (error) {
        console.error("Error formatting date:", error);
        return 'Invalid Date';
    }
};

// --- Data Fetching Functions ---
// These functions simulate fetching data from APIs.  Replace with actual API calls.

// Central Bank Rate Data (Replace with actual data source)
const fetchCBRData = async (): Promise<{ date: string; rate: number }[]> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Sample data (replace with actual data)
    const sampleData: { date: string; rate: number }[] = [
        { date: '2018-01-01', rate: 9.50 },
        { date: '2018-04-01', rate: 9.00 },
        { date: '2018-07-01', rate: 9.00 },
        { date: '2018-10-01', rate: 9.00 },
        { date: '2019-01-01', rate: 9.00 },
        { date: '2019-04-01', rate: 9.00 },
        { date: '2019-07-01', rate: 9.00 },
        { date: '2019-10-01', rate: 8.50 },
        { date: '2020-01-01', rate: 8.25 },
        { date: '2020-04-01', rate: 7.25 },
        { date: '2020-07-01', rate: 7.00 },
        { date: '2020-10-01', rate: 7.00 },
        { date: '2021-01-01', rate: 7.00 },
        { date: '2021-04-01', rate: 7.00 },
        { date: '2021-07-01', rate: 7.00 },
        { date: '2021-10-01', rate: 7.00 },
        { date: '2022-01-01', rate: 7.00 },
        { date: '2022-04-01', rate: 7.50 },
        { date: '2022-07-01', rate: 8.25 },
        { date: '2022-10-01', rate: 8.75 },
        { date: '2023-01-01', rate: 9.50 },
        { date: '2023-04-01', rate: 9.50 },
        { date: '2023-07-01', rate: 10.50 },
        { date: '2023-10-01', rate: 12.50 },
        { date: '2024-01-01', rate: 13.00 },
    ];
    return sampleData;
};

// GDP Data (Replace with actual data source)
const fetchGDPData = async (): Promise<{ year: string; gdp: number }[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Sample data (replace with actual data)
    const sampleData: { year: string; gdp: number }[] = [
        { year: '2018', gdp: 99.21 },
        { year: '2019', gdp: 101.86 },
        { year: '2020', gdp: 98.61 },
        { year: '2021', gdp: 110.22 },
        { year: '2022', gdp: 115.45 },
    ];
    return sampleData;
};

// Debt Data (Replace with actual data source)
const fetchDebtData = async (): Promise<{ year: string; debt: number }[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    // Sample data (replace with actual data)
    const sampleData: { year: string; debt: number }[] = [
        { year: '2018', debt: 50.2 },
        { year: '2019', debt: 55.1 },
        { year: '2020', debt: 65.4 },
        { year: '2021', debt: 68.2 },
        { year: '2022', debt: 67.5 },
    ];
    return sampleData;
};

// Trade Balance Data (Replace with actual data source)
const fetchTradeBalanceData = async (): Promise<{ year: string; tradeBalance: number }[]> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    // Sample data (replace with actual data)
    const sampleData: { year: string; tradeBalance: number }[] = [
        { year: '2018', tradeBalance: -10.5 },
        { year: '2019', tradeBalance: -11.2 },
        { year: '2020', tradeBalance: -10.8 },
        { year: '2021', tradeBalance: -12.1 },
        { year: '2022', tradeBalance: -13.5 },
    ];
    return sampleData;
};

// Inflation Data
const fetchInflationData = async (): Promise<{ year: string, inflation: number }[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const sampleData: { year: string, inflation: number }[] = [
        { year: '2018', inflation: 5.72 },
        { year: '2019', inflation: 5.28 },
        { year: '2020', inflation: 5.62 },
        { year: '2021', inflation: 6.14 },
        { year: '2022', inflation: 7.66 },
        { year: '2023', inflation: 7.70 },
    ];
    return sampleData;
}

// Unemployment Data
const fetchUnemploymentData = async (): Promise<{ year: string; unemployment: number }[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const sampleData: { year: string; unemployment: number }[] = [
        { year: '2018', unemployment: 5.8 },
        { year: '2019', unemployment: 5.5 },
        { year: '2020', unemployment: 6.2 },
        { year: '2021', unemployment: 5.9 },
        { year: '2022', unemployment: 5.7 },
    ];
    return sampleData;
};

// --- Components ---

// Reusable Chart Component
const EconomicChart: React.FC<{
    data: any[];
    dataKey: string;
    title: string;
    xAxisLabel: string;
    yAxisLabel: string;
    type?: 'line' | 'area' | 'bar';
    color?: string;
    secondDataKey?: string; // Optional second data key for dual-line charts
    secondColor?: string;
    legend?: boolean;
}> = ({ data, dataKey, title, xAxisLabel, yAxisLabel, type = 'line', color = '#8884d8', secondDataKey, secondColor, legend }) => {
    return (
        <Card className="mb-6 shadow-lg border-gray-700">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-200">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    {type === 'line' && (
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
                            <XAxis
                                dataKey="year"
                                tick={{ fill: '#9ca3af' }}
                                tickLine={false}
                                axisLine={false}
                                label={{ value: xAxisLabel, position: 'insideBottom', offset: 0, fill: '#9ca3af' }}
                            />
                            <YAxis
                                tick={{ fill: '#9ca3af' }}
                                tickLine={false}
                                axisLine={false}
                                label={{ value: yAxisLabel, position: 'insideLeft', offset: 0, fill: '#9ca3af', angle: -90 }}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#2d3748', border: 'none', color: '#fff', borderRadius: '0.5rem' }}
                                itemStyle={{ color: '#fff' }}
                                cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                            />
                            <Legend
                                wrapperStyle={{ color: '#9ca3af' }}
                                formatter={() => <span style={{ color: '#9ca3af' }}>{dataKey}</span>}
                            />
                            <Line
                                type="monotone"
                                dataKey={dataKey}
                                stroke={color}
                                strokeWidth={3}
                                dot={false}
                                activeDot={{ r: 8 }}
                            />
                            {secondDataKey && secondColor && (
                                <Line
                                    type="monotone"
                                    dataKey={secondDataKey}
                                    stroke={secondColor}
                                    strokeWidth={3}
                                    dot={false}
                                    activeDot={{ r: 8 }}
                                />
                            )}
                        </LineChart>
                    )}
                    {type === 'area' && (
                        <AreaChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
                            <XAxis
                                dataKey="year"
                                tick={{ fill: '#9ca3af' }}
                                tickLine={false}
                                axisLine={false}
                                label={{ value: xAxisLabel, position: 'insideBottom', offset: 0, fill: '#9ca3af' }}
                            />
                            <YAxis
                                tick={{ fill: '#9ca3af' }}
                                tickLine={false}
                                axisLine={false}
                                label={{ value: yAxisLabel, position: 'insideLeft', offset: 0, fill: '#9ca3af', angle: -90 }}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#2d3748', border: 'none', color: '#fff', borderRadius: '0.5rem' }}
                                itemStyle={{ color: '#fff' }}
                                cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                            />
                            <Area type="monotone" dataKey={dataKey} fill={color} fillOpacity={0.3} stroke={color} />
                        </AreaChart>
                    )}
                    {type === 'bar' && (
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
                            <XAxis
                                dataKey="year"
                                tick={{ fill: '#9ca3af' }}
                                tickLine={false}
                                axisLine={false}
                                label={{ value: xAxisLabel, position: 'insideBottom', offset: 0, fill: '#9ca3af' }}
                            />
                            <YAxis
                                tick={{ fill: '#9ca3af' }}
                                tickLine={false}
                                axisLine={false}
                                label={{ value: yAxisLabel, position: 'insideLeft', offset: 0, fill: '#9ca3af', angle: -90 }}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#2d3748', border: 'none', color: '#fff', borderRadius: '0.5rem' }}
                                itemStyle={{ color: '#fff' }}
                                cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                            />
                            <Legend
                                wrapperStyle={{ color: '#9ca3af' }}
                                formatter={() => <span style={{ color: '#9ca3af' }}>{dataKey}</span>}
                            />
                            <Bar dataKey={dataKey} fill={color} />
                            {secondDataKey && secondColor && (
                                <Bar dataKey={secondDataKey} fill={secondColor} />
                            )}
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

// Central Bank Rate Component
const CentralBankRate: React.FC<{ cbrData: { date: string; rate: number }[] | null; loading: boolean }> = ({ cbrData, loading }) => {
    const [selectedYear, setSelectedYear] = useState<string>('All');
    const years = cbrData ? [...new Set(cbrData.map(item => new Date(item.date).getFullYear().toString()))] : [];

    const filteredData = selectedYear === 'All'
        ? cbrData
        : cbrData?.filter(item => new Date(item.date).getFullYear().toString() === selectedYear);

    const latestRate = cbrData ? cbrData[cbrData.length - 1]?.rate : null;
    const latestDate = cbrData ? cbrData[cbrData.length - 1]?.date : null;

    return (
        <Card className="mb-6 shadow-lg border-gray-700">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-200 flex items-center gap-2">
                    <Landmark className="w-6 h-6 text-blue-400" />
                    Central Bank Rate (CBR)
                </CardTitle>
                <CardDescription className="text-gray-400">
                    The Central Bank Rate is the base interest rate set by the Central Bank of Kenya.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-full bg-gray-700" />
                        <Skeleton className="h-300 w-full bg-gray-700" />
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <span className="text-gray-300 font-medium">Latest Rate:</span>
                                <span className="text-xl font-bold text-white">{latestRate !== null ? `${latestRate}%` : 'N/A'}</span>
                                {latestDate && (
                                    <span className="text-gray-400 text-sm">({formatDate(latestDate)})</span>
                                )}
                            </div>
                            <div className="mt-4 sm:mt-0">
                                <Select onValueChange={setSelectedYear} value={selectedYear}>
                                    <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-gray-200">
                                        <SelectValue placeholder="Select Year" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-800 border-gray-700">
                                        <SelectItem value="All" className="hover:bg-gray-700/50 text-gray-200">All Years</SelectItem>
                                        {years.map(year => (
                                            <SelectItem key={year} value={year} className="hover:bg-gray-700/50 text-gray-200">
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {filteredData && filteredData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={filteredData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
                                    <XAxis
                                        dataKey="date"
                                        tick={{ fill: '#9ca3af' }}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={formatDate}
                                        label={{ value: 'Date', position: 'insideBottom', offset: 0, fill: '#9ca3af' }}
                                    />
                                    <YAxis
                                        tick={{ fill: '#9ca3af' }}
                                        tickLine={false}
                                        axisLine={false}
                                        label={{ value: 'Rate (%)', position: 'insideLeft', offset: 0, fill: '#9ca3af', angle: -90 }}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#2d3748', border: 'none', color: '#fff', borderRadius: '0.5rem' }}
                                        itemStyle={{ color: '#fff' }}
                                        cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                                        formatter={(value: any) => `${value}%`}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="rate"
                                        stroke="#8884d8"
                                        strokeWidth={3}
                                        dot={false}
                                        activeDot={{ r: 8 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-gray-400 text-center py-8">No data available for the selected year.</div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
};

// GDP Component
const GDPComponent: React.FC<{ gdpData: { year: string; gdp: number }[] | null; loading: boolean }> = ({ gdpData, loading }) => {
    return (
        <Card className="mb-6 shadow-lg border-gray-700">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-200 flex items-center gap-2">
                    <Building2 className="w-6 h-6 text-green-400" />
                    Gross Domestic Product (GDP)
                </CardTitle>
                <CardDescription className="text-gray-400">
                    The total monetary value of all final goods and services produced within Kenya in a specific period.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-full bg-gray-700" />
                        <Skeleton className="h-300 w-full bg-gray-700" />
                    </div>
                ) : (
                    gdpData && gdpData.length > 0 ? (
                        <EconomicChart
                            data={gdpData}
                            dataKey="gdp"
                            title="GDP Over Time"
                            xAxisLabel="Year"
                            yAxisLabel="GDP (Billion KES)"
                            type="area"
                            color="#82ca9d"
                        />
                    ) : (
                        <div className="text-gray-400 text-center py-8">No GDP data available.</div>
                    )
                )}
            </CardContent>
        </Card>
    );
};

// National Debt Component
const NationalDebtComponent: React.FC<{ debtData: { year: string; debt: number }[] | null; loading: boolean }> = ({ debtData, loading }) => {
    return (
        <Card className="mb-6 shadow-lg border-gray-700">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-200 flex items-center gap-2">
                    <Banknote className="w-6 h-6 text-red-400" />
                    National Debt
                </CardTitle>
                <CardDescription className="text-gray-400">
                    The total amount of money that the Kenyan government owes to its creditors.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-full bg-gray-700" />
                        <Skeleton className="h-300 w-full bg-gray-700" />
                    </div>
                ) : (
                    debtData && debtData.length > 0 ? (
                        <EconomicChart
                            data={debtData}
                            dataKey="debt"
                            title="National Debt Over Time"
                            xAxisLabel="Year"
                            yAxisLabel="Debt (% of GDP)"
                            type="line"
                            color="#e55353"
                        />
                    ) : (
                        <div className="text-gray-400 text-center py-8">No National Debt data available.</div>
                    )
                )}
            </CardContent>
        </Card>
    );
};

// Trade Balance Component
const TradeBalanceComponent: React.FC<{ tradeBalanceData: { year: string; tradeBalance: number }[] | null; loading: boolean }> = ({ tradeBalanceData, loading }) => {
    return (
        <Card className="mb-6 shadow-lg border-gray-700">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-200 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-yellow-400" />
                    <TrendingDown className="w-6 h-6 text-yellow-400" />
                    Trade Balance
                </CardTitle>
                <CardDescription className="text-gray-400">
                    The difference between Kenya's exports and imports of goods and services.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-full bg-gray-700" />
                        <Skeleton className="h-300 w-full bg-gray-700" />
                    </div>
                ) : (
                    tradeBalanceData && tradeBalanceData.length > 0 ? (
                        <EconomicChart
                            data={tradeBalanceData}
                            dataKey="tradeBalance"
                            title="Trade Balance Over Time"
                            xAxisLabel="Year"
                            yAxisLabel="Trade Balance (Billion KES)"
                            type="bar"
                            color="#f4c030"
                        />
                    ) : (
                        <div className="text-gray-400 text-center py-8">No Trade Balance data available.</div>
                    )
                )}
            </CardContent>
        </Card>
    );
};

// Inflation Component
const InflationComponent: React.FC<{ inflationData: { year: string, inflation: number }[] | null, loading: boolean }> = ({ inflationData, loading }) => {
    return (
        <Card className="mb-6 shadow-lg border-gray-700">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-200 flex items-center gap-2">
                    <CircleDollarSign className="w-6 h-6 text-purple-400" />
                    Inflation Rate
                </CardTitle>
                <CardDescription className="text-gray-400">
                    The rate at which the general level of prices for goods and services is rising, and subsequently, purchasing power is falling.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-full bg-gray-700" />
                        <Skeleton className="h-300 w-full bg-gray-700" />
                    </div>
                ) : (
                    inflationData && inflationData.length > 0 ? (
                        <EconomicChart
                            data={inflationData}
                            dataKey="inflation"
                            title="Inflation Rate"
                            xAxisLabel="Year"
                            yAxisLabel="Inflation Rate (%)"
                            type="line"
                            color="#a855f7"
                        />
                    ) : (
                        <div className="text-gray-400 text-center py-8">No inflation data available.</div>
                    )
                )}
            </CardContent>
        </Card>
    );
};

const UnemploymentComponent: React.FC<{ unemploymentData: { year: string; unemployment: number }[] | null; loading: boolean }> = ({ unemploymentData, loading }) => {
    return (
        <Card className="mb-6 shadow-lg border-gray-700">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-200 flex items-center gap-2">
                    <Search className="w-6 h-6 text-amber-400" />
                    Unemployment Rate
                </CardTitle>
                <CardDescription className="text-gray-400">
                    The percentage of the labor force that is unemployed.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-full bg-gray-700" />
                        <Skeleton className="h-300 w-full bg-gray-700" />
                    </div>
                ) : (
                    unemploymentData && unemploymentData.length > 0 ? (
                        <EconomicChart
                            data={unemploymentData}
                            dataKey="unemployment"
                            title="Unemployment Rate"
                            xAxisLabel="Year"
                            yAxisLabel="Unemployment Rate (%)"
                            type="line"
                            color="#fbbf24"
                        />
                    ) : (
                        <div className="text-gray-400 text-center py-8">No unemployment data available.</div>
                    )
                )}
            </CardContent>
        </Card>
    );
};

// Main App Component
const KenyaEconomicAnalysisApp = () => {
    const [cbrData, setCBRData] = useState<{ date: string; rate: number }[] | null>(null);
    const [gdpData, setGDPData] = useState<{ year: string; gdp: number }[] | null>(null);
    const [debtData, setDebtData] = useState<{ year: string; debt: number }[] | null>(null);
    const [tradeBalanceData, setTradeBalanceData] = useState<{ year: string; tradeBalance: number }[] | null>(null);
    const [inflationData, setInflationData] = useState<{ year: string, inflation: number }[] | null>(null);
    const [unemploymentData, setUnemploymentData] = useState<{ year: string; unemployment: number }[] | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all data concurrently
                const [cbrResult, gdpResult, debtResult, tradeBalanceResult, inflationResult, unemploymentResult] = await Promise.all([
                    fetchCBRData(),
                    fetchGDPData(),
                    fetchDebtData(),
                    fetchTradeBalanceData(),
                    fetchInflationData(),
                    fetchUnemploymentData()
                ]);

                setCBRData(cbrResult);
                setGDPData(gdpResult);
                setDebtData(debtResult);
                setTradeBalanceData(tradeBalanceResult);
                setInflationData(inflationResult);
                setUnemploymentData(unemploymentResult);
            } catch (err: any) {
                setError(err.message || 'An error occurred while fetching data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Memoized data for charts to prevent unnecessary re-renders
    const memoizedCBRData = React.useMemo(() => cbrData, [cbrData]);
    const memoizedGDPData = React.useMemo(() => gdpData, [gdpData]);
    const memoizedDebtData = React.useMemo(() => debtData, [debtData]);
    const memoizedTradeBalanceData = React.useMemo(() => tradeBalanceData, [tradeBalanceData]);
    const memoizedInflationData = React.useMemo(() => inflationData, [inflationData]);
    const memoizedUnemploymentData = React.useMemo(() => unemploymentData, [unemploymentData]);

    if (error) {
        return (
            <div className="bg-gray-900 min-h-screen flex items-center justify-center">
                <div className="text-red-500 text-center">
                    <h1 className="text-3xl font-bold mb-4">Error</h1>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-900 min-h-screen p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl font-bold text-gray-100 mb-8 text-center"
                >
                    Kenya Economic Analysis
                </motion.h1>

                {loading ? (
                    <div className="space-y-8">
                        <Skeleton className="h-12 w-full bg-gray-700" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Skeleton className="h-64 w-full bg-gray-700" />
                            <Skeleton className="h-64 w-full bg-gray-700" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Skeleton className="h-64 w-full bg-gray-700" />
                            <Skeleton className="h-64 w-full bg-gray-700" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Skeleton className="h-64 w-full bg-gray-700" />
                            <Skeleton className="h-64 w-full bg-gray-700" />
                        </div>
                    </div>

                ) : (
                    <>
                        <CentralBankRate cbrData={memoizedCBRData} loading={false} />
                        <GDPComponent gdpData={memoizedGDPData} loading={false} />
                        <NationalDebtComponent debtData={memoizedDebtData} loading={false} />
                        <TradeBalanceComponent tradeBalanceData={memoizedTradeBalanceData} loading={false} />
                        <InflationComponent inflationData={memoizedInflationData} loading={false} />
                        <UnemploymentComponent unemploymentData={memoizedUnemploymentData} loading={false} />
                    </>
                )}
            </div>
        </div>
    );
};

export default KenyaEconomicAnalysisApp;
