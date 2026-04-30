import api from './api';

export const updateProfile = async (name, email) => {
    const response = await api.put('/users/me', { name, email });
    return response.data;
};

export const updatePassword = async (currentPassword, newPassword, confirmPassword) => {
    const response = await api.put('/users/change-password', { currentPassword, newPassword, confirmPassword });
    return response.data;
};