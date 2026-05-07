import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CURRENCY_SYMBOLS } from '../utils/constants';
import { useAuth } from '../context/AuthContext';

export default function TrendChart({ monthlyBreakdown }) {
    const { user } = useAuth();
    const symbol = CURRENCY_SYMBOLS[user?.preferredCurrency] || '$';

    if (!monthlyBreakdown?.length) {
        return (
            <Card>
                <CardHeader><CardTitle>Monthly Spending Trend</CardTitle></CardHeader>
                <CardContent className="flex items-center justify-center h-48 text-gray-400">
                    No data available
                </CardContent>
            </Card>
        );
    }

    // shorten month names for chart
    const data = monthlyBreakdown.map(m => ({
        ...m,
        monthName: m.monthName.substring(0, 3)
    }));

    return (
        <Card>
            <CardHeader><CardTitle>Monthly Spending Trend</CardTitle></CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="monthName" />
                        <YAxis tickFormatter={(v) => `${symbol}${v}`} />
                        <Tooltip formatter={(value) => `${symbol}${value.toFixed(2)}`} />
                        <Bar dataKey="total" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}