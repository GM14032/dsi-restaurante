import React from 'react';
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';

export const ConfirmNewInventory = ({
	openModal = false,
	closeModal = () => {},
	createInventory = () => {},
	title = 'Crear nuevo inventario',
	description = 'Se creara un nuevo inventario, el inventario anterior pasara a ser el inventario inicial del nuevo periodo, ¿Desea continuar?',
}) => {
	return (
		<Modal id='myModal' isOpen={openModal} toggle={closeModal}>
			<ModalHeader
				className='modal-title'
				id='myModalLabel'
				toggle={closeModal}
			>
				{title}
			</ModalHeader>
			<ModalBody>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '1rem',
					}}
				>
					<h6>{description}</h6>
				</div>
			</ModalBody>
			<div className='modal-footer'>
				<Button color='light' onClick={closeModal}>
					Cancelar
				</Button>
				<Button color='primary' onClick={createInventory}>
					Aceptar
				</Button>
			</div>
		</Modal>
	);
};

export default ConfirmNewInventory;
