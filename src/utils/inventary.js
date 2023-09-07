const LOW_STOCK = 5;

export const getTotals = (items) => {
	const total = items.reduce((acc, item) => {
		return acc + item.price * item.quantity;
	}, 0);
	return total;
};

export const getLowStock = () => {
	return LOW_STOCK;
};
