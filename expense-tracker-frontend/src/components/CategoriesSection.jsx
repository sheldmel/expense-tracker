import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CategoryItem from './CategoryItem';
import { createCategory, updateCategory, deleteCategory } from '../services/category';
import CategoryModal from './CategoryModal';

export default function CategoriesSection({ categories, onCategoriesChange }) {
    const [error, setError] = useState(null);
    const [modal, setModal] = useState({ open: false, category: null });

    const handleSave = async (data, id) => {
        try {
            if (id) {
                await updateCategory(id, data);
            } else {
                await createCategory(data);
            }
            onCategoriesChange(); // ← notify parent to refetch
            setModal({ open: false, category: null });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save category');
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteCategory(id);
            onCategoriesChange(); // ← already here ✓
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete category');
        }
    };

    const customCategories = categories.filter(c => !c.default);

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Categories</h2>
                <Button
                    size="sm"
                    onClick={() => setModal({ open: true, category: null })}
                    disabled={customCategories.length >= 3}
                >
                    <Plus size={16} className="mr-1" /> Add
                </Button>
            </div>

            {customCategories.length >= 3 && (
                <p className="text-sm text-gray-500 mb-2">
                    Maximum of 3 custom categories reached
                </p>
            )}

            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            <div className="space-y-2">
                {categories.map(category => (
                    <CategoryItem
                        key={category.id}
                        category={category}
                        onEdit={(cat) => setModal({ open: true, category: cat })}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            <CategoryModal
                open={modal.open}
                category={modal.category}
                onClose={() => setModal({ open: false, category: null })}
                onSave={handleSave}
            />
        </div>
    );
}