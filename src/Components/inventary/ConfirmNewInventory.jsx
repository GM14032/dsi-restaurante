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

export const ConfirmNewInventory = ({
	openModal = false,
	closeModal = () => {},
	createInventory = () => {},
}) => {
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
					<h6>
						Se creara un nuevo inventario, el inventario anterior pasara a ser
						el inventario inicial del nuevo periodo, ¿Desea continuar?
					</h6>
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
