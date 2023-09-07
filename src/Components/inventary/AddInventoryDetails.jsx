import { postRequest } from '@/api';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React, { useState, useEffect } from 'react';
import {
	Button,
	Label,
	Modal,
	ModalBody,
	ModalHeader,
	Input,
} from 'reactstrap';

export const AddInventoryDetails = ({
	ingredients = [],
	openModal = false,
	inventory,
	closeModalHandler = () => {},
	setNewInventary = () => {},
	inventaryDetails = [],
}) => {
	const [data, setData] = useState({
		ingredient: null,
		quantity: '',
		price: '',
		inventory,
		isEntry: true,
	});
	const [error, setError] = useState('');

	useEffect(() => {
		if (inventory) {
			setData({ ...data, inventory });
		}
	}, [inventory]);

	const getPriceAndQuantity = (id) => {
		const total = inventaryDetails.reduce(
			(acc, item) => {
				if (item.ingredient.id === id) {
					if (item.isEntry) {
						return {
							...acc,
							ePrice: acc.ePrice + item.price * item.quantity,
							eQuantity: acc.eQuantity + item.quantity,
						};
					} else {
						return {
							...acc,
							oPrice: acc.oPrice - item.price * item.quantity,
							oQuantity: acc.oQuantity + item.quantity,
						};
					}
				}
				return acc;
			},
			{ ePrice: 0, eQuantity: 0, oPrice: 0, oQuantity: 0 }
		);
		return {
			price: total.ePrice,
			quantity: total.eQuantity,
			outStock: total.oQuantity,
		};
	};

	const validateData = () => {
		if (!data.ingredient) {
			setError('Ingrediente es requerido');
			return false;
		}
		if (!data.quantity) {
			setError('Cantidad es requerido');
			return false;
		}
		if (!data.price) {
			setError('Precio es requerido');
			return false;
		}
		if (data.quantity <= 0) {
			setError('Cantidad debe ser mayor a 0');
			return false;
		}
		if (data.price <= 0) {
			setError('Precio debe ser mayor a 0');
			return false;
		}
		const { quantity, outStock } = getPriceAndQuantity(data?.ingredient?.id);
		console.log(quantity, outStock, data.quantity);
		if (!data.isEntry && +data.quantity > quantity - outStock) {
			setError(
				`No hay suficiente cantidad de ${data.ingredient.name}, existen ${
					quantity - outStock
				} en el inventario`
			);
			return false;
		}
		return true;
	};

	const initialValues = () => {
		setData({
			ingredient: null,
			quantity: '',
			price: '',
			inventory,
		});
	};

	const handleIngredientChange = (e) => {
		if (error) setError('');
		let averagePrice = '';
		if (!data.isEntry) {
			const { price, quantity } = getPriceAndQuantity(e.target.value);
			console.log(quantity);
			averagePrice = price > 0 && quantity > 0 ? price / quantity : '';
		}
		setData({
			...data,
			ingredient: ingredients.find((i) => i.id === e.target.value),
			price: averagePrice,
		});
	};

	const handleNewDetail = async () => {
		if (!validateData()) return;
		try {
			const request = await postRequest(data, 'inventorydetails');
			const newDetail = await request.json();
			setNewInventary(newDetail);
			closeModalHandler();
			initialValues();
		} catch (e) {
			console.log(e);
			setError('Error al crear el detalle');
		}
	};

	const closeModal = () => {
		closeModalHandler();
		initialValues();
	};

	const handleChange = (e) => {
		if (error) setError('');
		setData({
			...data,
			[e.target.name]: e.target.value,
		});
	};

	return (
		<Modal id='myModal' isOpen={openModal} toggle={closeModal}>
			<ModalHeader
				className='modal-title'
				id='myModalLabel'
				toggle={closeModal}
			>
				Agregar nuevo detalle
			</ModalHeader>
			<ModalBody>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '1rem',
					}}
				>
					<span
						style={{
							color: 'red',
						}}
					>
						{error}
					</span>
					<div
						className='order-form-group order-form-select'
						style={{
							alignItems: 'end',
						}}
					>
						<Label htmlFor='table' className='order-form-label'>
							Ingrediente:
						</Label>
						<FormControl variant='standard' sx={{ m: 1, minWidth: 120 }}>
							<InputLabel id='order_state'>Ingrediente</InputLabel>
							<Select
								labelId='order_state'
								id='order_state'
								name='order_state'
								label='Order State'
								value={data.ingredient?.id || ''}
								onChange={handleIngredientChange}
							>
								{ingredients.map((ingredient) => (
									<MenuItem key={ingredient.id} value={ingredient.id}>
										{ingredient.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</div>
					<div className='order-form-group'>
						<Label htmlFor='entry' className='order-form-label'>
							Entrada:
						</Label>
						<div
							className='order-form-input'
							style={{
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'start',
								gap: '1rem',
								color: 'orange',
							}}
						>
							<Input
								type='checkbox'
								id='entry'
								name='entry'
								checked={data.isEntry}
								onChange={(e) => {
									if (error) setError('');
									setData({
										...data,
										isEntry: !data.isEntry,
									});
								}}
							/>
							<label htmlFor='entry'>
								{data.isEntry
									? 'Agregando al inventario'
									: 'Quitando del inventario'}
							</label>
						</div>
					</div>
					<div className='order-form-group'>
						<Label htmlFor='description' className='order-form-label'>
							Precio:
						</Label>
						<div className='order-form-input'>
							<Input
								type='number'
								className='form-control'
								name='price'
								id='price'
								value={data.price}
								onChange={handleChange}
								placeholder='Precio'
							/>
						</div>
					</div>
					<div className='order-form-group'>
						<Label htmlFor='description' className='order-form-label'>
							Cantidad:
						</Label>
						<div className='order-form-input'>
							<Input
								type='number'
								className='form-control'
								name='quantity'
								id='quantity'
								value={data.quantity}
								onChange={handleChange}
								placeholder='Cantidad'
							/>
						</div>
					</div>
				</div>
			</ModalBody>
			<div className='modal-footer'>
				<Button color='light' onClick={closeModal}>
					Cancelar
				</Button>
				<Button color='primary' onClick={handleNewDetail}>
					Aceptar
				</Button>
			</div>
		</Modal>
	);
};

export default AddInventoryDetails;
