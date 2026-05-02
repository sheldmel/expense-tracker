import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Pencil, Trash2 } from 'lucide-react';

export default function BudgetItem({ budget, onEdit, onDelete }) {
    return (
        <div className="p-3 border rounded-lg bg-white space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: budget.categoryColor }}
                    />
                    <span className="font-medium">{budget.categoryName}</span>
                    {budget.percentageUsed >= 100 && (
                        <Badge variant="destructive" className="text-xs">Over budget</Badge>
                    )}
                    {budget.percentageUsed >= 80 && budget.percentageUsed < 100 && (
                        <Badge variant="outline" className="text-xs text-orange-500">Near limit</Badge>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                        ${budget.spentAmount} / ${budget.limitAmount}
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => onEdit(budget)}>
                        <Pencil size={14} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(budget.id)}
                        className="text-red-500 hover:text-red-600"
                    >
                        <Trash2 size={14} />
                    </Button>
                </div>
            </div>
            <Progress value={Math.min(budget.percentageUsed, 100)} />
            <p className="text-xs text-gray-500">
                {budget.percentageUsed?.toFixed(1)}% used · ${budget.remaining} remaining
            </p>
        </div>
    );
}