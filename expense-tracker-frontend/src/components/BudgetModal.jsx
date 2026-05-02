import { useState, useEffect } from 'react';
import FormModal from './FormModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import FormField from './FormField';
import { useAuth } from '../context/AuthContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CURRENCY_SYMBOLS } from '../utils/constants';


export default function BudgetModal({ open, budget, categories, onClose, onSave }) {
    const [categoryId, setCategoryId] = useState('');
    const [limitAmount, setLimitAmount] = useState('');
    const { user } = useAuth();
    const symbol = CURRENCY_SYMBOLS[user.preferredCurrency] || '$';

    useEffect(() => {
        if (budget) {
            setCategoryId(budget.categoryId?.toString() || '');
            setLimitAmount(budget.limitAmount?.toString() || '');
        } else {
            setCategoryId('');
            setLimitAmount('');
        }
    }, [budget, open]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ categoryId: Number(categoryId), limitAmount: Number(limitAmount) }, budget?.id);
    };

    return (
        <FormModal
            open={open}
            onClose={onClose}
            title={'Set Budget'}
        >
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">


                <FormField label="Limit Amount" htmlFor="limitAmount">
                    <Input
                        id="limitAmount"
                        type="number"
                        min="0"
                        step="0.01"
                        value={limitAmount}
                        onChange={(e) => setLimitAmount(e.target.value)}
                        placeholder={`e.g. ${symbol}500`}
                        required
                    />
                </FormField>

                <div className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit">
                        {'Set'}
                    </Button>
                </div>
            </form>
        </FormModal>
    );
}