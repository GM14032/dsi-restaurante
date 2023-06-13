import { postRequest } from '@/api';
import { ValidationOrder } from '@/constant/validations';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useState } from 'react';

const useFormOrder = (products = []) => {
	const router = useRouter();
	const [orderDetails, setOrderDetails] = useState([]);
	const [orderData, setOrderData] = useState({
		description: '',
		table: '',
		category: '',
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
		const order = {
			orderDetails: orderDetails.map((od) => ({
				product: {
					id: od.id,
				},
				quantity: od.quantity,
				total: od.quantity * od.price,
			})),
			state: {
				id: 1, // start with state pending
			},
			tableNumber: 1,
			description: orderData.description,
			tableNumber: orderData.table,
			category: orderData.category,
		};
		const orderResponse = await postRequest(order, 'orders');
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

export default useFormOrder;
