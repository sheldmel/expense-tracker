import { useState } from 'react';
import { updateProfile } from '../services/user';
import { updatePassword } from '../services/user';
import PasswordInput from '@/components/PasswordInput';
import FormField from '@/components/FormField';
import { validatePassword } from '../utils/validatePassword';
import { useAuth } from '../context/AuthContext';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Profile() {
    const { user, updateUser } = useAuth();
    // Profile state
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);

    // Password state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // UI state
    const [profileLoading, setProfileLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);

    const [profileError, setProfileError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);

    const [profileSuccess, setProfileSuccess] = useState(null);
    const [passwordSuccess, setPasswordSuccess] = useState(null);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setProfileError(null);
        setProfileSuccess(null);
        setProfileLoading(true);

        try {
            console.log("Updating profile:", { name, email });
            const data = await updateProfile(name, email);
            if (data.token) {
                updateUser({ name: data.name, email: data.email }, data.token);
            } else {
                updateUser({ name: data.name, email: data.email });
            }
            setProfileSuccess("Profile updated successfully!");
        } catch (err) {
            setProfileError(
                err.response?.data?.message ||
                err.response?.data ||
                "Failed to update profile"
            );
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordError(null);
        setPasswordSuccess(null);

        if (!currentPassword) {
            setPasswordError("Current password is required");
            return;
        }

        const passwordError = validatePassword(newPassword, confirmPassword);
        if (passwordError) {
            setPasswordError(passwordError);
            return;
        }

        setPasswordLoading(true);

        try {
            const data = await updatePassword(currentPassword, newPassword, confirmPassword);
            setPasswordSuccess("Password changed successfully!");
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            const message =
                err.response?.data?.message ||
                err.response?.data ||
                "Failed to change password";

            setPasswordError(message);
            setPasswordSuccess(null);
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="bg-gray-100 py-20 px-4 flex justify-center">
            <Card className="w-full max-w-lg shadow-md">

                <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                    <CardDescription>
                        Update your personal details and password
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-8">

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Profile Information</h3>

                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <FormField label="Name" htmlFor="name">
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    required
                                />
                            </FormField>

                            <FormField label="Email" htmlFor="email">
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="abc@example.com"
                                    required
                                />
                            </FormField>

                            {profileError && (
                                <p className="text-sm text-red-500">{profileError}</p>
                            )}
                            {profileSuccess && (
                                <p className="text-sm text-green-600">{profileSuccess}</p>
                            )}

                            <Button type="submit" className="w-full" disabled={profileLoading}>
                                {profileLoading ? 'Updating...' : 'Update Profile'}
                            </Button>
                        </form>
                    </div>

                    <div className="border-t my-6" />

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Change Password</h3>

                        <form  noValidate onSubmit={handlePasswordChange} className="space-y-4">
                            <FormField label="Current Password" htmlFor="currentPassword">
                                <PasswordInput
                                    id="currentPassword"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                            </FormField>

                            <FormField label="New Password" htmlFor="newPassword">
                                <PasswordInput
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </FormField>

                            <FormField label="Confirm New Password" htmlFor="confirmPassword">
                                <PasswordInput
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </FormField>

                            {passwordError && (
                                <p className="text-sm text-red-500">{passwordError}</p>
                            )}
                            {passwordSuccess && (
                                <p className="text-sm text-green-600">{passwordSuccess}</p>
                            )}

                            <Button type="submit" className="w-full" disabled={passwordLoading}>
                                {passwordLoading ? 'Updating...' : 'Change Password'}
                            </Button>
                        </form>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
}