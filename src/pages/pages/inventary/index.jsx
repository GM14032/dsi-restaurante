import BreadCrumb from '@/Components/Common/BreadCrumb';
import Layout from '@/Layouts';
import React from 'react';
import { Container } from 'reactstrap';
import { getAll, getById } from '@/api';
import dynamic from 'next/dynamic';
import EmptyInventary from '@/Components/inventary/EmptyInventary';
import { useState } from 'react';
import { useEffect } from 'react';
import InventaryComponent from '@/Components/inventary/InventaryComponent';
import { getLowStock } from '@/utils/inventary';

import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';

const Inventary = ({ inventary, inventaryDetails = [], config }) => {
	const [inventaryData, setInventaryData] = useState({
		inventaryDetails: [],
		inventary: null,
		loading: true,
	});

	const [openModal, setOpenModal] = useState(false);

	useEffect(() => {
		if (inventary) {
			setInventaryData({ inventary, inventaryDetails, loading: false });
		} else {
			setInventaryData({
				inventary: null,
				inventaryDetails: [],
				loading: false,
			});
		}
	}, [inventary]);

	const addNewIDetail = () => {
		console.log('open modal');
		setOpenModal(!openModal);
	};

	const handleNewDetail = () => {
		console.log('new detail');
	};

	const setNewInventary = (inventary, inventaryDetails = []) => {
		if (inventary) {
			setInventaryData({
				inventary,
				inventaryDetails,
				loading: false,
			});
		}
	};

	return (
		<Layout title='Inventario'>
			<Container fluid>
				<BreadCrumb title='Inventario' pageTitle='Pages' />
				{inventaryData.inventary || inventary ? (
					<InventaryComponent
						{...inventaryData}
						config={config}
						addNewIDetail={addNewIDetail}
					/>
				) : (
					<EmptyInventary setNewInventary={setNewInventary} />
				)}
				<Modal id='myModal' isOpen={openModal} toggle={addNewIDetail}>
					<ModalHeader
						className='modal-title'
						id='myModalLabel'
						toggle={addNewIDetail}
					>
						Agregar nuevo detalle
					</ModalHeader>
					<ModalBody>
						<h5 className='fs-15'>detalleeee</h5>
					</ModalBody>
					<div className='modal-footer'>
						<Button color='light' onClick={addNewIDetail}>
							Cancelar
						</Button>
						<Button color='primary' onClick={handleNewDetail}>
							Aceptar
						</Button>
					</div>
				</Modal>
			</Container>
		</Layout>
	);
};

export async function getServerSideProps() {
	try {
		const inventary = await (await getById('1', 'inventory')).json();
		const inventaryDetails = await (await getAll('inventorydetails')).json();
		const config = {
			lowStock: getLowStock(),
			canRemove: false,
			canAdd: true,
		};
		return {
			props: { inventary, inventaryDetails, config },
		};
	} catch (error) {
		return {
			props: { error: 'Ocurrió un error al obtener el inventario', config: {} },
		};
	}
}

export default dynamic(() => Promise.resolve(Inventary), { ssr: false });
