import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

export default function ExpenseFilters({ filters, categories, onChange, onReset }) {
    return (
        <div className="flex flex-wrap gap-2 mb-4">
            <Select
                value={filters.categoryId?.toString() || 'all'}
                onValueChange={(v) => onChange({ ...filters, categoryId: v === 'all' ? null : Number(v), page: 0 })}
            >
                <SelectTrigger className="w-36">
                    <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                            {cat.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Input
                type="date"
                className="w-36"
                value={filters.startDate || ''}
                onChange={(e) => onChange({ ...filters, startDate: e.target.value || null, page: 0 })}
            />

            <Input
                type="date"
                className="w-36"
                value={filters.endDate || ''}
                onChange={(e) => onChange({ ...filters, endDate: e.target.value || null, page: 0 })}
            />

            <Select
                value={filters.sortBy}
                onValueChange={(v) => onChange({ ...filters, sortBy: v, page: 0 })}
            >
                <SelectTrigger className="w-32">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="amount">Amount</SelectItem>
                </SelectContent>
            </Select>

            <Select
                value={filters.sortDir}
                onValueChange={(v) => onChange({ ...filters, sortDir: v, page: 0 })}
            >
                <SelectTrigger className="w-32">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {filters.sortBy === 'date' ? (
                        <>
                            <SelectItem value="desc">Newest</SelectItem>
                            <SelectItem value="asc">Oldest</SelectItem>
                        </>
                    ) : (
                        <>
                            <SelectItem value="desc">Highest</SelectItem>
                            <SelectItem value="asc">Lowest</SelectItem>
                        </>
                    )}
                </SelectContent>
            </Select>

            <Button variant="ghost" size="sm" onClick={onReset}>
                <X size={16} className="mr-1" /> Reset
            </Button>
        </div>
    );
}