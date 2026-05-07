import api from './api';

export const getDashboardSummary = async (month, year) => {
    const response = await api.get('/dashboard/summary', { params: { month, year } });
    return response.data;
};