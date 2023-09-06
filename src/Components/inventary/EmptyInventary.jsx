import React, { useState } from 'react';
import error from '../../assets/images/error.svg';
import Image from 'next/image';
import Loader from '../Common/Loader';
import { getById, postRequest } from '@/api';
import BtnCreateInventary from './BtnCreateInventary';

const EmptyInventary = ({ createInventaryFromZero }) => {
	return (
		<div className='empty-inventary'>
			<h1>
				No tienes un inventario activo, por favor crea uno presionando el
				siguiente botón
			</h1>
			<Image src={error} alt='' height='230' className='move-animation' />
			<BtnCreateInventary createInventaryFromZero={createInventaryFromZero} />
		</div>
	);
};

export default EmptyInventary;
