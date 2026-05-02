import api from './api';

export const getBudgets = async (month, year) => {
    const response = await api.get('/budgets', { params: { month, year } });
    return response.data;
};

export const createBudget = async (data) => {
    const response = await api.post('/budgets', data);
    return response.data;
};

export const updateBudget = async (id, data) => {
    const response = await api.put(`/budgets/${id}`, data);
    return response.data;
};

export const deleteBudget = async (id) => {
    await api.delete(`/budgets/${id}`);
};