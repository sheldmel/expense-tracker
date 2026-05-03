export const CURRENCY_SYMBOLS = {
    USD: '$',
    INR: '₹',
    GBP: '£'
};

export const CURRENCY_OPTIONS = [
    { value: 'USD', label: 'USD — US Dollar', symbol: '$' },
    { value: 'INR', label: 'INR — Indian Rupee', symbol: '₹' },
    { value: 'GBP', label: 'GBP — British Pound', symbol: '£' }
];

export const CATEGORY_COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
    '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
];

export const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];


export const DEFAULT_FILTERS = {
    categoryId: null,
    startDate: null,
    endDate: null,
    sortBy: 'date',
    sortDir: 'desc',
    page: 0,
    size: 10
};