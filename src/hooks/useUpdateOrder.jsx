import { putRequest } from '@/api';
import { ValidationOrderUpdate } from '@/constant/validations';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useState } from 'react';

const useUpdateOrder = (products = [], order) => {
	const router = useRouter();
	const [orderDetails, setOrderDetails] = useState(() =>
		order.orderDetails.map((od) => ({
			...od,
			name: od.product.name,
			price: od.product.price,
		}))
	);
	const [orderData, setOrderData] = useState({
		description: order.description || '',
		table: order.tableNumber || '',
		category: order.category || '',
		order_state: order.state.id || '',
	});
	const [error, setError] = useState('');

	const validation = useFormik({
		enableReinitialize: true,
		validationSchema: ValidationOrderUpdate,
		initialValues: orderData,
	});

	const handleChange = (event) => {
		const fieldName = event.target.name;
		const value = event.target.value;
		validation.handleChange(event);
		setOrderData({
			...orderData,
			[fieldName]: value,
		});
	};

	const getProductsThatAreNotInOrderDetails = () => {
		const ids = orderDetails.map((od) => od.product.id);
		return products.filter((p) => !ids.includes(p.id));
	};

	const addOrderDetail = (orderDetail) => {
		const exists = orderDetails.find((od) => od.product.id === orderDetail.id);
		if (exists) {
			return;
		}
		setOrderDetails([
			...orderDetails,
			{
				id: `id-${orderDetail.id}`,
				name: orderDetail.name,
				price: orderDetail.price,
				quantity: 1,
				product: { id: orderDetail.id },
			},
		]);
	};

	const removeOrderDetail = (orderDetail) => {
		const newOrderDetails = orderDetails.filter(
			(od) => od.id !== orderDetail.id
		);
		setOrderDetails(newOrderDetails);
	};

	const createOrder = async () => {
		const isValid = await validation.validateForm();
		if (isValid.description || isValid.table) {
			// show errors
			validation.setFieldTouched('category', true);
			validation.setFieldTouched('table', true);
			return;
		}
		if (orderDetails.length === 0) {
			setError('Debe agregar al menos un producto');
			return;
		}
		console.log({ order });
		const newOrders = {
			orderDetails: orderDetails.map((od) => {
				const id = Number.isInteger(+od.id) ? od.id : undefined;
				return {
					...od,
					id,
					quantity: od.quantity,
					total: od.quantity * od.price,
					order: {
						id: order.id,
					},
				};
			}),
			state: {
				id: orderData.order_state, // start with state pending
			},
			tableNumber: 1,
			description: orderData.description,
			tableNumber: orderData.table,
			category: orderData.category,
			total: orderDetails.reduce((acc, od) => acc + od.total, 0),
		};
		const orderResponse = await putRequest(order.id, newOrders, 'orders');
		if (orderResponse.error) {
			setError(orderResponse.error);
			return;
		}
		if (orderResponse.ok) {
			router.push('/pages/orden');
		}
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
		validation,
		error,
		getProductsThatAreNotInOrderDetails,
		addOrderDetail,
		removeOrderDetail,
		createOrder,
		handleQuantity,
		handleChange,
	};
};

export default useUpdateOrder;
