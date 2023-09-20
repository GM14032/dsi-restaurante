import { postRequest } from '@/api';
import { ValidationOrder } from '@/constant/validations';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useState } from 'react';

const useFormProduct = (ingredients = []) => {
	const router = useRouter();
	const [ingredientDetails, setIngredientDetails] = useState([]);
	const [productData, setProductData] = useState({
		name: '',
		price: 0.00,
	});
	const [error, setError] = useState('');

	const validation = useFormik({
		enableReinitialize: true,
		validationSchema: ValidationOrder,
		initialValues: productData,
	});

	const handleChange = (event) => {
		const fieldName = event.target.name;
		const value = event.target.value;
		validation.handleChange(event);
		setProductData({
			...productData,
			[fieldName]: value,
		});
	};

	const getIngredientsThatAreNotInOrderDetails = () => {
		const ids = ingredientDetails.map((od) => od.id);
		return ingredients.filter((p) => !ids.includes(p.id));
	};

	const addIngredientDetail = (ingredientDetail) => {
		const exists = ingredientDetails.find((od) => od.id === ingredientDetail.id);
		if (exists) {
			return;
		}
		setIngredientDetails([...ingredientDetails, ingredientDetail]);
	};

	const removeIngredientDetail = (ingredientDetail) => {
		const newIngredientDetails = ingredientDetails.filter(
			(od) => od.id !== ingredientDetail.id
		);
		setIngredientDetails(newIngredientDetails);
	};

	const createProduct = async (currentTable) => {
		const isValid = await validation.validateForm();
		if (isValid.description) {
			// show errors
			validation.setFieldTouched('price', true);
			return;
		}
		if (ingredientDetails.length === 0) {
			setError('Debe agregar al menos un ingrediente');
			return;
		}
		const product = {
			ingredientDetails: ingredientDetails.map((od) => ({
				ingredient: {
					id: od.id,
				},
				quantity: od.quantity,
				total: od.quantity * od.price,
			})),
			state: {
				id: 1, // start with state pending
			},
			//tableNumber: 1,
			name: productData.name,
			price: productData.price,
			total: ingredientDetails.reduce((acc, od) => acc + od.total, 0),
		};
		const productResponse = await postRequest(product, 'products');
		if (productResponse.error) {
			setError(productResponse.error);
			return;
		}
		if (productResponse.ok) {
			const productJson = await productResponse.json();
			const response = await postRequest(
				{
					message:
						'Se ha creado un nuevo producto con el número: # ',
					redirect: `/pages/products/${productJson.id}`,
					roles: ['Admin', 'Chef'],
				},
				'notifications'
			);
			const notificationsResponse = await response.json();
			await fetch(`${process.env.NEXT_PUBLIC_API_URL}/message/send`, {
				method: 'POST',
				body: JSON.stringify({
					content:
						'Se ha creado un nuevo producto  con el número: # ',
					roles: ['Admin', 'Chef'],
					idNotification: notificationsResponse.id,
					redirect: `/pages/products/${productJson.id}`,
				}),
				headers: {
					'Content-Type': 'application/json',
				},
			});
			router.push('/pages/products');
		}
	};

	const handleQuantity = (ingredientDetail, quantity) => {
		const newIngredientDetails = ingredientDetails.map((od) => {
			if (od.id === ingredientDetail.id) {
				return {
					...od,
					quantity,
					total: od.price * quantity,
				};
			}
			return od;
		});
		setIngredientDetails(newIngredientDetails);
	};

	return {
		ingredientDetails,
		validation,
		error,
		getIngredientsThatAreNotInOrderDetails,
		addIngredientDetail,
		removeIngredientDetail,
		createProduct,
		handleQuantity,
		handleChange,
	};
};

export default useFormProduct;