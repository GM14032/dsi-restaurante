import React, { useState } from 'react';
import error from '../../assets/images/error.svg';
import Image from 'next/image';
import Loader from '../Common/Loader';
import { getById, postRequest } from '@/api';

const EmptyInventary = ({ createInventaryFromZero }) => {
	const [creating, setCreating] = useState(false);

	const createInventary = async () => {
		setCreating(true);
		const newInventary = await (
			await postRequest({ active: true }, 'inventary')
		).json();

		const inventaryDetail = await (
			await getById(newInventary.id, 'inventorydetails')
		).json();

		setTimeout(() => {
			createInventaryFromZero(newInventary, inventaryDetail);
		}, 3000);
	};

	return (
		<div className='empty-inventary'>
			<h1>
				No tienes un inventario activo, por favor crea uno presionando el
				siguiente botón
			</h1>
			<Image src={error} alt='' height='230' className='move-animation' />
			<button
				disabled={creating}
				href='/'
				className='btn btn-secondary'
				onClick={createInventary}
			>
				<i className='mdi mdi-home me-1'></i>Crear inventario
			</button>
			{creating && <Loader />}
		</div>
	);
};

export default EmptyInventary;
