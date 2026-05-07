import { Card, CardContent } from '@/components/ui/card';
import { CURRENCY_SYMBOLS } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, Receipt, Tag } from 'lucide-react';

export default function StatCards({ totalSpent, totalExpenses, spendingByCategory }) {
    const { user } = useAuth();
    const symbol = CURRENCY_SYMBOLS[user?.preferredCurrency] || '$';
    const topCategory = spendingByCategory?.[0]?.categoryName || 'N/A';

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Spent</p>
                            <p className="text-2xl font-bold">
                                {symbol}{totalSpent?.toFixed(2) || '0.00'}
                            </p>
                        </div>
                        <TrendingUp className="text-gray-400" size={24} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Expenses</p>
                            <p className="text-2xl font-bold">{totalExpenses || 0}</p>
                        </div>
                        <Receipt className="text-gray-400" size={24} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Top Category</p>
                            <p className="text-2xl font-bold">{topCategory}</p>
                        </div>
                        <Tag className="text-gray-400" size={24} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}