import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, totalElements, size, onPageChange }) {
    const start = page * size + 1;
    const end = Math.min((page + 1) * size, totalElements);

    // generate page numbers to show
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let startPage = Math.max(0, page - 2);
        let endPage = Math.min(totalPages - 1, startPage + maxVisible - 1);

        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(0, endPage - maxVisible + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-500">
                Showing {start}-{end} of {totalElements}
            </p>
            <div className="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 0}
                >
                    <ChevronLeft size={16} />
                </Button>

                {getPageNumbers().map(p => (
                    <Button
                        key={p}
                        variant={p === page ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => onPageChange(p)}
                    >
                        {p + 1}
                    </Button>
                ))}

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page === totalPages - 1}
                >
                    <ChevronRight size={16} />
                </Button>
            </div>
        </div>
    );
}