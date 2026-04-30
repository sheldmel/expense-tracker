import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../services/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PasswordInput from '@/components/PasswordInput';
import FormField from '@/components/FormField';
import { validatePassword } from '../utils/validatePassword';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const passwordError = validatePassword(password, confirmPassword);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        setLoading(true);
        try {
            const data = await registerUser({ name, email, password, preferredCurrency: currency });
            login({ name: data.name, email: data.email }, data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data || err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl">Create an account</CardTitle>
                    <CardDescription>Start tracking your expenses today</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <FormField label="Name" htmlFor="name">
                            <Input
                                id="name"
                                placeholder="Shelton"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </FormField>

                        <FormField label="Email" htmlFor="email">
                            <Input
                                id="email"
                                type="email"
                                placeholder="shelton@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </FormField>

                        <FormField label="Password" htmlFor="password">
                            <PasswordInput
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </FormField>

                        <FormField label="Confirm Password" htmlFor="confirmPassword">
                            <PasswordInput
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </FormField>

                        <FormField label="Preferred Currency" htmlFor="currency">
                            <Select value={currency} onValueChange={setCurrency}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="USD">USD — US Dollar</SelectItem>
                                    <SelectItem value="INR">INR — Indian Rupee</SelectItem>
                                    <SelectItem value="GBP">GBP — British Pound</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormField>

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Creating account...' : 'Create account'}
                        </Button>

                        <p className="text-center text-sm text-gray-500">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-600 hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}