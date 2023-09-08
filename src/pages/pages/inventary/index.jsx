import React, { useState, useEffect } from 'react';
import BreadCrumb from '@/Components/Common/BreadCrumb';
import Layout from '@/Layouts';
import { Container } from 'reactstrap';
import { getAll, getById } from '@/api';
import dynamic from 'next/dynamic';
import EmptyInventary from '@/Components/inventary/EmptyInventary';
import InventaryComponent from '@/Components/inventary/InventaryComponent';
import { getLowStock } from '@/utils/inventary';

const Movements = ({ inventary, inventaryDetails = [], config }) => {
	const [inventaryData, setInventaryData] = useState({
		inventaryDetails: [],
		inventary: null,
		loading: true,
	});

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
						createInventaryFromZero={createInventaryFromZero}
					/>
				) : (
					<EmptyInventary
						createInventaryFromZero={createInventaryFromZero}
						showBtn={false}
					/>
				)}
			</Container>
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
			canAdd: false,
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

export default dynamic(() => Promise.resolve(Movements), { ssr: false });
