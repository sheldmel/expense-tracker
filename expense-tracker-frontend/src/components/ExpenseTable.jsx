import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2 } from 'lucide-react';
import { CURRENCY_SYMBOLS } from '../utils/constants';
import { useAuth } from '../context/AuthContext';

export default function ExpenseTable({ expenses, onEdit, onDelete, readOnly = false }) {
    const { user } = useAuth();
    const symbol = CURRENCY_SYMBOLS[user?.preferredCurrency] || '$';

    if (expenses.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                No expenses found
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        {!readOnly && <TableHead className="text-right">Actions</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {expenses.map(expense => (
                        <TableRow key={expense.id}>
                            <TableCell className="font-medium">{expense.description}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-2 h-2 rounded-full"
                                        style={{ backgroundColor: expense.categoryColor }}
                                    />
                                    <span>{expense.categoryName}</span>
                                </div>
                            </TableCell>
                            <TableCell className="font-semibold">
                                {symbol}{expense.amount.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-gray-500">
                                {new Date(expense.date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </TableCell>
                            {!readOnly && (
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onEdit(expense)}
                                    >
                                        <Pencil size={14} />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onDelete(expense.id)}
                                        className="text-red-500 hover:text-red-600"
                                    >
                                        <Trash2 size={14} />
                                    </Button>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}