import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getBudgets, createBudget, updateBudget, deleteBudget } from '../services/budget';
import BudgetItem from './BudgetItem';
import BudgetModal from './BudgetModal';

const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const currentYear = new Date().getFullYear();
const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1, currentYear + 2];

export default function BudgetsSection({ categories }) {
    const [budgets, setBudgets] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modal, setModal] = useState({ open: false, budget: null });

    const fetchBudgets = async () => {
        try {
            const data = await getBudgets(selectedMonth, selectedYear);
            setBudgets(data);
        } catch (err) {
            setError('Failed to load budgets');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBudgets();
    }, [selectedMonth, selectedYear]);

    const handleSave = async (data, id) => {
        try {
            if (id) {
                await updateBudget(id, data);
            } else {
                await createBudget({ ...data, month: selectedMonth, year: selectedYear });
            }
            await fetchBudgets();
            setModal({ open: false, budget: null });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save budget');
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteBudget(id);
            await fetchBudgets();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete budget');
        }
    };

    if (loading) return <div>Loading budgets...</div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Budgets</h2>
                <div className="flex items-center gap-2">
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

            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            <div className="space-y-3">
                {categories.map(category => {
                    const budget = budgets.find(b => b.categoryName === category.name);

                    if (budget) {
                        return (
                            <BudgetItem
                                key={category.name}
                                budget={budget}
                                onEdit={(b) => setModal({ open: true, budget: b })}
                                onDelete={handleDelete}
                            />
                        );
                    }

                    return (
                        <div key={category.name} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: category.color }}
                                />
                                <span className="font-medium text-gray-400">{category.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-gray-400">No budget set</span>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setModal({ open: true, budget: { categoryId: category.id, categoryName: category.name } })}
                                >
                                    + Set
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <BudgetModal
                open={modal.open}
                budget={modal.budget}
                categories={categories}
                onClose={() => setModal({ open: false, budget: null })}
                onSave={handleSave}
            />
        </div>
    );
}