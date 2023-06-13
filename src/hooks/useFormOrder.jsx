import { useState } from 'react';

const useFormOrder = (products = []) => {
	const [orderDetails, setOrderDetails] = useState([]);

	const getProductsThatAreNotInOrderDetails = () => {
		const ids = orderDetails.map((od) => od.id);
		return products.filter((p) => !ids.includes(p.id));
	};

	const addOrderDetail = (orderDetail) => {
		const exists = orderDetails.find((od) => od.id === orderDetail.id);
		if (exists) {
			return;
		}
		setOrderDetails([...orderDetails, orderDetail]);
	};

	const removeOrderDetail = (orderDetail) => {
		const newOrderDetails = orderDetails.filter(
			(od) => od.id !== orderDetail.id
		);
		setOrderDetails(newOrderDetails);
	};

	const createOrder = async () => {
		const order = {
			order_details: orderDetails.map((od) => ({
				product_id: od.id,
				quantity: od.quantity,
			})),
		};
		console.log(order);
	};

	const handleQuantity = (orderDetail, quantity) => {
		const newOrderDetails = orderDetails.map((od) => {
			if (od.id === orderDetail.id) {
				return {
					...od,
					quantity,
					total: od.price * quantity,
				};
			}
			return od;
		});
		setOrderDetails(newOrderDetails);
	};

	return {
		orderDetails,
		getProductsThatAreNotInOrderDetails,
		addOrderDetail,
		removeOrderDetail,
		createOrder,
		handleQuantity,
	};
};

export default useFormOrder;
