// Settings.jsx
import { useState, useEffect } from 'react';
import { getCategories } from '../services/category';
import CategoriesSection from '../components/CategoriesSection';
import BudgetsSection from '../components/BudgetsSection';

export default function Settings() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCategories = async () => {
        const data = await getCategories();
        setCategories(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <CategoriesSection
                categories={categories}
                onCategoriesChange={fetchCategories}
            />
            <hr />
            <BudgetsSection
                categories={categories}
            />
        </div>
    );
}