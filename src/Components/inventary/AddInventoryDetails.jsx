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
}) => {
	const [data, setData] = useState({
		ingredient: null,
		quantity: '',
		price: '',
		inventory,
	});
	const [error, setError] = useState('');

	useEffect(() => {
		if (inventory) {
			setData({ ...data, inventory });
		}
	}, [inventory]);

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
		return true;
	};

	const handleNewDetail = async () => {
		if (!validateData()) return;
		try {
			const request = await postRequest(
				{ ...data, isEntry: true },
				'inventorydetails'
			);
			const newDetail = await request.json();
			setNewInventary(newDetail);
			closeModalHandler();
		} catch (e) {
			console.log(e);
			setError('Error al crear el detalle');
		}
	};

	const handleChange = (e) => {
		if (error) setError('');
		setData({
			...data,
			[e.target.name]: e.target.value,
		});
	};

	return (
		<Modal id='myModal' isOpen={openModal} toggle={closeModalHandler}>
			<ModalHeader
				className='modal-title'
				id='myModalLabel'
				toggle={closeModalHandler}
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
								onChange={(e) => {
									if (error) setError('');
									setData({
										...data,
										ingredient: ingredients.find(
											(i) => i.id === e.target.value
										),
									});
								}}
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
				<Button color='light' onClick={closeModalHandler}>
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
