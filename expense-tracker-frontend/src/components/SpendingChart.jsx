import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CURRENCY_SYMBOLS } from '../utils/constants';
import { useAuth } from '../context/AuthContext';

export default function SpendingChart({ spendingByCategory }) {
    const { user } = useAuth();
    const symbol = CURRENCY_SYMBOLS[user?.preferredCurrency] || '$';

    if (!spendingByCategory?.length) {
        return (
            <Card>
                <CardHeader><CardTitle>Spending by Category</CardTitle></CardHeader>
                <CardContent className="flex items-center justify-center h-48 text-gray-400">
                    No data available
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader><CardTitle>Spending by Category</CardTitle></CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={spendingByCategory}
                            dataKey="total"
                            nameKey="categoryName"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label={({ categoryName, percent }) =>
                                `${categoryName} ${(percent * 100).toFixed(0)}%`
                            }
                        >
                            {spendingByCategory.map((entry, index) => (
                                <Cell key={index} fill={entry.categoryColor} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${symbol}${value.toFixed(2)}`} />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}