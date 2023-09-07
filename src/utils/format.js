export const getDollarFormat = (value) => {
	if (value && typeof value === 'number') {
		return `$${value.toFixed(2)}`;
	}
	return '$0.00';
};

export const formatDate = (date) => {
	if (date) {
		return new Date(date).toISOString().split('T')[0];
	}
	return '';
};
