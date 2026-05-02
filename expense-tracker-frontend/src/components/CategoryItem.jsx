import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2 } from 'lucide-react';

export default function CategoryItem({ category, onEdit, onDelete }) {
    return (
        <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
            <div className="flex items-center gap-3">
                <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                />
                <span className="font-medium">{category.name}</span>
                {category.default && (
                    <Badge variant="secondary" className="text-xs">default</Badge>
                )}
            </div>
            {!category.default && (
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(category)}>
                        <Pencil size={14} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(category.id)}
                        className="text-red-500 hover:text-red-600"
                    >
                        <Trash2 size={14} />
                    </Button>
                </div>
            )}
        </div>
    );
}