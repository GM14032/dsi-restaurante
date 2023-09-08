import React, { useState } from 'react';
import error from '../../assets/images/error.svg';
import Image from 'next/image';
import BtnCreateInventary from './BtnCreateInventary';

const EmptyInventary = ({
	createInventaryFromZero = () => {},
	showBtn = true,
	title = 'No tienes un inventario activo, por favor crea uno presionando el siguiente botón',
}) => {
	return (
		<div className='empty-inventary'>
			<h1>{title}</h1>
			<Image src={error} alt='' height='230' className='move-animation' />
			{showBtn && (
				<BtnCreateInventary createInventaryFromZero={createInventaryFromZero} />
			)}
		</div>
	);
};

export default EmptyInventary;
