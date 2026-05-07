import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CURRENCY_SYMBOLS } from '../utils/constants';
import { useAuth } from '../context/AuthContext';

export default function RecentExpenses({ recentExpenses }) {
    const { user } = useAuth();
    const symbol = CURRENCY_SYMBOLS[user?.preferredCurrency] || '$';

    if (!recentExpenses?.length) {
        return (
            <Card>
                <CardHeader><CardTitle>Recent Expenses</CardTitle></CardHeader>
                <CardContent className="text-center text-gray-400 py-6">
                    No recent expenses
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader><CardTitle>Recent Expenses</CardTitle></CardHeader>
            <CardContent className="space-y-3">
                {recentExpenses.map((expense, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: expense.categoryColor }}
                            />
                            <div>
                                <p className="text-sm font-medium">{expense.description}</p>
                                <p className="text-xs text-gray-400">{expense.categoryName}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-semibold">
                                {symbol}{expense.amount?.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-400">
                                {new Date(expense.date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}