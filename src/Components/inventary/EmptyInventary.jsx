import React from 'react';
import error from '../../assets/images/error.svg';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Loader from '../Common/Loader';

const EmptyInventary = ({ setNewInventary }) => {
	const [creating, setCreating] = useState(false);
	const router = useRouter();

	const createInventary = () => {
		setCreating(true);
		setTimeout(() => {
			setNewInventary({ name: 'test' }, []);
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
