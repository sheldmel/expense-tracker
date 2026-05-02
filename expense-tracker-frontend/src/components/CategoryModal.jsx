import { useState, useEffect } from 'react';
import FormModal from './FormModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import FormField from './FormField';
import { CATEGORY_COLORS } from '../utils/constants';

const COLORS = CATEGORY_COLORS;

export default function CategoryModal({ open, category, onClose, onSave }) {
    const [name, setName] = useState('');
    const [color, setColor] = useState(COLORS[0]);

    useEffect(() => {
        if (category) {
            setName(category.name);
            setColor(category.color);
        } else {
            setName('');
            setColor(COLORS[0]);
        }
    }, [category, open]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ name, color }, category?.id);
    };

    return (
        <FormModal
            open={open}
            onClose={onClose}
            title={category ? 'Edit Category' : 'Add Category'}
        >
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                <FormField label="Name" htmlFor="categoryName">
                    <Input
                        id="categoryName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Gym"
                        required
                    />
                </FormField>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Color</label>
                    <div className="flex gap-2 flex-wrap">
                        {COLORS.map(c => (
                            <button
                                key={c}
                                type="button"
                                onClick={() => setColor(c)}
                                className={`w-7 h-7 rounded-full border-2 transition-all ${
                                    color === c ? 'border-gray-800 scale-110' : 'border-transparent'
                                }`}
                                style={{ backgroundColor: c }}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit">
                        {category ? 'Save' : 'Add'}
                    </Button>
                </div>
            </form>
        </FormModal>
    );
}