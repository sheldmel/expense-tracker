import { useState, useEffect } from 'react';
import { getDashboardSummary } from '../services/dashboard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StatCards from '../components/StatCards';
import SpendingChart from '../components/SpendingChart';
import TrendChart from '../components/TrendChart';
import BudgetProgress from '../components/BudgetProgress';
import RecentExpenses from '../components/RecentExpenses';

const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const currentYear = new Date().getFullYear();
const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1, currentYear + 2];

export default function Dashboard() {
    const [view, setView] = useState('monthly');
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const month = view === 'monthly' ? selectedMonth : null;
            const result = await getDashboardSummary(month, selectedYear);
            setData(result);
        } catch (err) {
            setError('Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [view, selectedMonth, selectedYear]);

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <h1 className="text-2xl font-bold">Dashboard</h1>

                <div className="flex items-center gap-2">
                    {/* Toggle */}
                    <div className="flex border rounded-lg overflow-hidden">
                        <button
                            className={`px-4 py-2 text-sm font-medium transition-colors ${
                                view === 'monthly' ? 'bg-primary text-primary-foreground' : 'bg-white hover:bg-gray-50'
                            }`}
                            onClick={() => setView('monthly')}
                        >
                            Monthly
                        </button>
                        <button
                            className={`px-4 py-2 text-sm font-medium transition-colors ${
                                view === 'yearly' ? 'bg-primary text-primary-foreground' : 'bg-white hover:bg-gray-50'
                            }`}
                            onClick={() => setView('yearly')}
                        >
                            Yearly
                        </button>
                    </div>

                    {/* Month selector — only for monthly view */}
                    {view === 'monthly' && (
                        <Select
                            value={selectedMonth.toString()}
                            onValueChange={(v) => setSelectedMonth(Number(v))}
                        >
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {monthNames.map((name, index) => (
                                    <SelectItem key={index + 1} value={(index + 1).toString()}>
                                        {name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}

                    {/* Year selector */}
                    <Select
                        value={selectedYear.toString()}
                        onValueChange={(v) => setSelectedYear(Number(v))}
                    >
                        <SelectTrigger className="w-24">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {years.map(year => (
                                <SelectItem key={year} value={year.toString()}>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            {loading ? (
                <div className="text-center py-12">Loading...</div>
            ) : (
                <div className="space-y-6">
                    {/* Stat cards — always show */}
                    <StatCards
                        totalSpent={data?.totalSpent}
                        totalExpenses={data?.totalExpenses}
                        spendingByCategory={data?.spendingByCategory}
                    />

                    {/* Charts row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SpendingChart spendingByCategory={data?.spendingByCategory} />
                        {view === 'yearly'
                            ? <TrendChart monthlyBreakdown={data?.monthlyBreakdown} />
                            : <BudgetProgress budgetSummary={data?.budgetSummary} />
                        }
                    </div>

                    {/* Recent expenses — always show */}
                    <RecentExpenses recentExpenses={data?.recentExpenses} />
                </div>
            )}
        </div>
    );
}