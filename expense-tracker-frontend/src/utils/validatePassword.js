export const validatePassword = (password, confirmPassword) => {
    if (password.length < 8)
        return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(password))
        return 'Password must contain at least one uppercase letter';
    if (!/[0-9]/.test(password))
        return 'Password must contain at least one number';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
        return 'Password must contain at least one special character';
    if (password !== confirmPassword)
        return 'Passwords do not match';
    return null;
};