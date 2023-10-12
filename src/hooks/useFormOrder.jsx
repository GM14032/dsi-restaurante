import { postRequest } from '@/api';
import { ValidationOrder } from '@/constant/validations';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useState } from 'react';

const useFormOrder = (setTableError = () => {}) => {
	const router = useRouter();
	const [orderDetails, setOrderDetails] = useState({});
	const [orderData, setOrderData] = useState({
		description: '',
	});
	const [error, setError] = useState('');

	const validation = useFormik({
		enableReinitialize: true,
		validationSchema: ValidationOrder,
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

	const addOrderDetail = (orderDetail) => {
		if (orderDetails[orderDetail.id]) {
			setOrderDetails({
				...orderDetails,
				[orderDetail.id]: {
					...orderDetails[orderDetail.id],
					quantity: orderDetails[orderDetail.id].quantity + 1,
				},
			});
			return;
		}
		setOrderDetails({
			...orderDetails,
			[orderDetail.id]: {
				...orderDetail,
				quantity: 1,
			},
		});
	};

	const removeOrderDetail = (orderDetail) => {
		if (orderDetails[orderDetail.id].quantity > 1) {
			setOrderDetails({
				...orderDetails,
				[orderDetail.id]: {
					...orderDetails[orderDetail.id],
					quantity: orderDetails[orderDetail.id].quantity - 1,
				},
			});
			return;
		}
		const { [orderDetail.id]: orderDetailToRemove, ...rest } = orderDetails;
		setOrderDetails(rest);
	};

	const createOrder = async (currentTable) => {
		const isValid = await validation.validateForm();
		if (isValid.description) {
			// show errors
			validation.setFieldTouched('description', true);
			return;
		}
		if (!currentTable) {
			setTableError('Debe seleccionar una mesa');
			return;
		}
		if (Object.keys(orderDetails).length === 0) {
			setError('Debe agregar al menos un producto');
			return;
		}
		const order = {
			orderDetails: Object.values(orderDetails).map((od) => ({
				product: {
					id: od.id,
				},
				quantity: od.quantity,
				total: od.quantity * od.price,
			})),
			state: {
				id: 1, // start with state pending
			},
			table: currentTable,
			description: orderData.description,
			total: Object.values(orderDetails).reduce((acc, od) => acc + od.total, 0),
		};
		const orderResponse = await postRequest(order, 'orders');
		if (orderResponse.error) {
			setError(orderResponse.error);
			return;
		}
		if (orderResponse.ok) {
			const orderJson = await orderResponse.json();
			const response = await postRequest(
				{
					message:
						'Se ha creado una nueva orden con el número: # ' +
						orderJson.numberOrder,
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
						'Se ha creado una nueva orden con el número: # ' +
						orderJson.numberOrder,
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

	return {
		orderDetails,
		validation,
		error,
		addOrderDetail,
		removeOrderDetail,
		createOrder,
		handleChange,
	};
};

export default useFormOrder;
