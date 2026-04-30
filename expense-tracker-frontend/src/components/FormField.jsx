import { Label } from '@/components/ui/label';

export default function FormField({ label, htmlFor, children }) {
    return (
        <div className="space-y-2">
            <Label htmlFor={htmlFor}>{label}</Label>
            {children}
        </div>
    );
}