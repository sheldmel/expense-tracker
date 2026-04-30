import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { LayoutDashboard, Receipt, Settings, User, LogOut, Menu } from 'lucide-react';

const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Expenses', path: '/expenses', icon: Receipt },
    { label: 'Settings', path: '/settings', icon: Settings },
    { label: 'Profile', path: '/profile', icon: User },
];

export default function Navbar() {
    const { user, logout } = useAuth();
    const location = useLocation();

    const NavLinks = () => (
        <>
            {navItems.map(({ label, path, icon: Icon }) => (
                <Link key={path} to={path}>
                    <Button
                        variant={location.pathname === path ? 'default' : 'ghost'}
                        size="sm"
                        className="flex items-center gap-2 w-full justify-start"
                    >
                        <Icon size={16} />
                        {label}
                    </Button>
                </Link>
            ))}
        </>
    );

    return (
        <nav className="border-b bg-white px-5 py-3 flex items-center justify-between">
            <Link to="/dashboard" className="font-bold text-xl">
                Expense Tracker
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
                <NavLinks />
            </div>

            {/* Desktop user info and logout */}
            <div className="hidden md:flex items-center gap-3">
                <span className="text-sm text-gray-500">Hi, {user?.name}</span>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="flex items-center gap-2 text-red-500 hover:text-red-600"
                >
                    <LogOut size={16} />
                    Logout
                </Button>
            </div>

            {/* Mobile nav */}
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="sm">
                            <Menu size={20} />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64">
                        <div className="flex flex-col gap-2 mt-6">
                            <NavLinks />
                            <hr className="my-2" />
                            <span className="text-sm text-gray-500 px-2">Hi, {user?.name}</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={logout}
                                className="flex items-center gap-2 justify-start text-red-500"
                            >
                                <LogOut size={16} />
                                Logout
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    );
}