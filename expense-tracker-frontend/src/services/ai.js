import api from './api';

export const suggestCategory = async (description) => {
    const response = await api.post('/ai/suggest-category', { description });
    return response.data;
};