import { postRequest, putRequest } from '@/api';
import { ValidationOrderUpdate } from '@/constant/validations';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useState } from 'react';
import useTable from './useTable';

const useUpdateOrder = (products = [], order, orderStates = []) => {
	const router = useRouter();
	const { tables } = useTable('');
	const [orderDetails, setOrderDetails] = useState(() =>
		order.orderDetails.map((od) => ({
			...od,
			name: od.product.name,
			price: od.product.price,
		}))
	);
	const [orderData, setOrderData] = useState({
		description: order.description || '',
		table: order.table?.id || '',
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
				total: orderDetail.price,
				quantity: 1,
				product: { id: orderDetail.id, price: orderDetail.price },
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
		if (isValid.description) {
			// show errors
			validation.setFieldTouched('category', true);
			return;
		}
		if (orderDetails.length === 0) {
			setError('Debe agregar al menos un producto');
			return;
		}
		const newOrders = {
			orderDetails: orderDetails.map((od) => {
				const id = Number.isInteger(+od.id) ? od.id : undefined;
				return {
					...od,
					id,
					quantity: od.quantity,
					total: od.quantity * od.product.price,
					order: {
						id: order.id,
					},
				};
			}),
			state: {
				...orderStates.find((os) => os.id === orderData.order_state),
				id: orderData.order_state, // start with state pending
			},
			tableNumber: orderData.table,
			table: tables.find((t) => t.id === +orderData.table),
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
			const orderJson = await orderResponse.json();
			const response = await postRequest(
				{
					message:
						'Orden número: # ' +
						orderJson.numberOrder +
						' actualizada, estado: ' +
						orderJson.state.name,
					redirect: `/pages/orden/${orderJson.id}`,
					roles: ['Admin', 'Chef'],
				},
				'notifications'
			);
			const notificationsResponse = await response.json();

			await fetch(`${process.env.NEXT_PUBLIC_API_URL}/message/send`, {
				method: 'POST',
				body: JSON.stringify({
					content:
						'Orden número: # ' +
						orderJson.numberOrder +
						' actualizada, estado: ' +
						orderJson.state.name,
					roles: ['Admin', 'Chef'],
					idNotification: notificationsResponse.id,
					redirect: `/pages/orden/${orderJson.id}`,
				}),
				headers: {
					'Content-Type': 'application/json',
				},
			});
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
		tables,
		getProductsThatAreNotInOrderDetails,
		addOrderDetail,
		removeOrderDetail,
		createOrder,
		handleQuantity,
		handleChange,
	};
};

export default useUpdateOrder;
