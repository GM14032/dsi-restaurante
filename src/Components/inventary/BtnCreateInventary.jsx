import { getById, postRequest } from '@/api';
import { Loader } from 'feather-icons-react/build/IconComponents';
import React, { useState } from 'react';
import ConfirmNewInventory from './ConfirmNewInventory';

const BtnCreateInventary = ({ createInventaryFromZero, inventary }) => {
	const [creating, setCreating] = useState(false);
	const [openModal, setOpenModal] = useState(false);

	const handleCreateInventary = () => {
		if (!inventary) {
			createInventary();
		} else {
			setOpenModal(true);
		}
	};

	const createInventary = async () => {
		setCreating(true);
		const newInventary = await (
			await postRequest({ active: true }, 'inventory')
		).json();

		const inventaryDetail = await (
			await getById(newInventary.id, 'inventorydetails')
		).json();

		setTimeout(() => {
			createInventaryFromZero(newInventary, inventaryDetail);
			setCreating(false);
			setOpenModal(false);
		}, 3000);
	};

	return (
		<>
			<button
				disabled={creating}
				href='/'
				className='btn btn-secondary'
				onClick={handleCreateInventary}
			>
				<i className='mdi mdi-file-edit-outline me-1'></i>Crear inventario
			</button>
			{creating && !inventary && <Loader />}
			<ConfirmNewInventory
				closeModal={() => setOpenModal(false)}
				createInventory={createInventary}
				openModal={openModal}
			/>
		</>
	);
};

export default BtnCreateInventary;
