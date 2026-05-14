import { useState, useEffect } from 'react';
import FormModal from './FormModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import FormField from './FormField';
import { suggestCategory } from '../services/ai';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CURRENCY_SYMBOLS } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Loader2 } from 'lucide-react';

export default function ExpenseModal({ open, expense, categories, onClose, onSave }) {
    const { user } = useAuth();
    const symbol = CURRENCY_SYMBOLS[user?.preferredCurrency] || '$';

    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [aiLoading, setAiLoading] = useState(false);

    useEffect(() => {
        if (expense) {
            setDescription(expense.description || '');
            setAmount(expense.amount?.toString() || '');
            setDate(expense.date || '');
            setCategoryId(expense.categoryId?.toString() || '');
        } else {
            setDescription('');
            setAmount('');
            setDate(new Date().toISOString().split('T')[0]);
            setCategoryId('');
        }
    }, [expense, open, categories]);

    const handleAiSuggest = async () => {
        if (!description) return;
        setAiLoading(true);
        try {
            const data = await suggestCategory(description);
            console.log(data);
            const match = categories.find(c =>
                c.name.toLowerCase() === data.suggestedCategory.toLowerCase()
            );
            if (match) setCategoryId(match.id.toString());
        } catch (err) {
            console.error(err);
        } finally {
            setAiLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            description,
            amount: Number(amount),
            date,
            categoryId: Number(categoryId)
        }, expense?.id);
    };

    return (
        <FormModal
            open={open}
            onClose={onClose}
            title={expense ? 'Edit Expense' : 'Add Expense'}
        >
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                <FormField label="Description" htmlFor="description">
                    <div className="flex gap-2">
                        <Input
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g. McDonald's"
                            required
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleAiSuggest}
                            disabled={!description || aiLoading}
                            title="AI suggest category"
                        >
                            {aiLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Sparkles className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </FormField>
                <FormField label={`Amount (${symbol})`} htmlFor="amount">
                    <Input
                        id="amount"
                        type="number"
                        min="0"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder={`e.g. ${symbol}15.00`}
                        required
                    />
                </FormField>

                <FormField label="Date" htmlFor="date">
                    <Input
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </FormField>

                <FormField label="Category" htmlFor="category">
                    <Select value={categoryId} onValueChange={setCategoryId} disabled={aiLoading}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map(cat => (
                                <SelectItem key={cat.id} value={cat.id.toString()}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </FormField>

                <div className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit">
                        {expense ? 'Save' : 'Add'}
                    </Button>
                </div>
            </form>
        </FormModal>
    );
}