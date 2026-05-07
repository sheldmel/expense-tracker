import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CURRENCY_SYMBOLS } from '../utils/constants';
import { useAuth } from '../context/AuthContext';

export default function BudgetProgress({ budgetSummary }) {
    const { user } = useAuth();
    const symbol = CURRENCY_SYMBOLS[user?.preferredCurrency] || '$';

    if (!budgetSummary?.length) {
        return (
            <Card>
                <CardHeader><CardTitle>Budget Progress</CardTitle></CardHeader>
                <CardContent className="text-center text-gray-400 py-6">
                    No budgets set for this month
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader><CardTitle>Budget Progress</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                {budgetSummary.map(budget => (
                    <div key={budget.categoryName} className="space-y-1">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: budget.categoryColor }}
                                />
                                <span className="text-sm font-medium">{budget.categoryName}</span>
                                {budget.percentageUsed >= 100 && (
                                    <Badge variant="destructive" className="text-xs">Over</Badge>
                                )}
                                {budget.percentageUsed >= 80 && budget.percentageUsed < 100 && (
                                    <Badge variant="outline" className="text-xs text-orange-500">Near</Badge>
                                )}
                            </div>
                            <span className="text-sm text-gray-500">
                                {symbol}{budget.spentAmount?.toFixed(2)} / {symbol}{budget.limitAmount?.toFixed(2)}
                            </span>
                        </div>
                        <Progress value={Math.min(budget.percentageUsed, 100)} />
                        <p className="text-xs text-gray-400 text-right">
                            {budget.percentageUsed?.toFixed(1)}% used
                        </p>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}