export const getDollarFormat = (value) => {
	if (value && typeof value === 'number') {
		return `$${value.toFixed(2)}`;
	}
	return '$0.00';
};
