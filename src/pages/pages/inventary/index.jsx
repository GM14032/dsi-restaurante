import React, { useState, useEffect } from 'react';
import BreadCrumb from '@/Components/Common/BreadCrumb';
import Layout from '@/Layouts';
import { Container } from 'reactstrap';
import { getAll, getById } from '@/api';
import dynamic from 'next/dynamic';
import EmptyInventary from '@/Components/inventary/EmptyInventary';
import InventaryComponent from '@/Components/inventary/InventaryComponent';
import { getLowStock } from '@/utils/inventary';
import AddInventoryDetails from '@/Components/inventary/AddInventoryDetails';

const Inventary = ({
	inventary,
	inventaryDetails = [],
	config,
	ingredients = [],
}) => {
	const [inventaryData, setInventaryData] = useState({
		inventaryDetails: [],
		inventary: null,
		loading: true,
	});
	const [openModal, setOpenModal] = useState(false);
	const openModalHandler = () => setOpenModal(!openModal);
	const closeModalHandler = () => setOpenModal(false);

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

	const setNewInventary = (inventaryDetail) => {
		if (inventary) {
			setInventaryData({
				inventary,
				inventaryDetails: [inventaryDetail, ...inventaryData.inventaryDetails],
				loading: false,
			});
		}
	};

	const createInventaryFromZero = (inventary, inventaryDetails = []) => {
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
						addNewIDetail={openModalHandler}
						createInventaryFromZero={createInventaryFromZero}
					/>
				) : (
					<EmptyInventary createInventaryFromZero={createInventaryFromZero} />
				)}
			</Container>
			<AddInventoryDetails
				ingredients={ingredients}
				openModal={openModal}
				closeModalHandler={closeModalHandler}
				inventory={inventaryData.inventary}
				setNewInventary={setNewInventary}
			/>
		</Layout>
	);
};

export async function getServerSideProps() {
	try {
		const [inventary] = await (
			await getAll('inventory', '?active=true')
		).json();

		const inventaryDetails = await (
			await getById(inventary.id, 'inventorydetails')
		).json();

		const ingredients = await (await getAll('ingredients')).json();

		const config = {
			lowStock: getLowStock(),
			canRemove: false,
			canAdd: true,
		};
		return {
			props: {
				inventary,
				inventaryDetails,
				config,
				ingredients,
			},
		};
	} catch (error) {
		return {
			props: { error: 'Ocurrió un error al obtener el inventario', config: {} },
		};
	}
}

export default dynamic(() => Promise.resolve(Inventary), { ssr: false });
