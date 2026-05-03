import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { getExpenses, createExpense, updateExpense, deleteExpense } from '../services/expense';
import { getCategories } from '../services/category';
import ExpenseTable from '../components/ExpenseTable';
import ExpenseFilters from '../components/ExpenseFilters';
import ExpenseModal from '../components/ExpenseModal';
import Pagination from '../components/Pagination';
import {DEFAULT_FILTERS} from '../utils/constants';

export default function Expenses() {
    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [pagination, setPagination] = useState({ totalPages: 0, totalElements: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modal, setModal] = useState({ open: false, expense: null });

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const data = await getExpenses(filters);
            setExpenses(data.content);
            setPagination({
                totalPages: data.totalPages,
                totalElements: data.totalElements
            });
        } catch (err) {
            setError('Failed to load expenses');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (err) {
            setError('Failed to load categories');
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchExpenses();
    }, [filters]);

    const handleSave = async (data, id) => {
        try {
            if (id) {
                await updateExpense(id, data);
            } else {
                await createExpense(data);
            }
            await fetchExpenses();
            setModal({ open: false, expense: null });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save expense');
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteExpense(id);
            await fetchExpenses();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete expense');
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Expenses</h1>
                <Button onClick={() => setModal({ open: true, expense: null })}>
                    <Plus size={16} className="mr-1" /> Add Expense
                </Button>
            </div>

            <ExpenseFilters
                filters={filters}
                categories={categories}
                onChange={setFilters}
                onReset={() => setFilters(DEFAULT_FILTERS)}
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            {loading ? (
                <div className="text-center py-12">Loading...</div>
            ) : (
                <>
                    <ExpenseTable
                        expenses={expenses}
                        onEdit={(expense) => setModal({ open: true, expense })}
                        onDelete={handleDelete}
                    />
                    <Pagination
                        page={filters.page}
                        totalPages={pagination.totalPages}
                        totalElements={pagination.totalElements}
                        size={filters.size}
                        onPageChange={(p) => setFilters({ ...filters, page: p })}
                    />
                </>
            )}

            <ExpenseModal
                open={modal.open}
                expense={modal.expense}
                categories={categories}
                onClose={() => setModal({ open: false, expense: null })}
                onSave={handleSave}
            />
        </div>
    );
}