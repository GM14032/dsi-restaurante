import React, { useState, useEffect } from 'react';
import BreadCrumb from '@/Components/Common/BreadCrumb';
import Layout from '@/Layouts';
import { Container } from 'reactstrap';
import { getById } from '@/api';
import dynamic from 'next/dynamic';
import InventaryComponent from '@/Components/inventary/InventaryComponent';
import { getLowStock } from '@/utils/inventary';

const InventaryById = ({ inventary, inventaryDetails = [], config }) => {
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

	return (
		<Layout title='Inventario'>
			<Container fluid>
				<BreadCrumb title='Inventario' pageTitle='Pages' />
				{inventaryData.inventary || inventary ? (
					<InventaryComponent {...inventaryData} config={config} />
				) : (
					<></>
				)}
			</Container>
		</Layout>
	);
};

export async function getServerSideProps({ params: { id } }) {
	try {
		const inventary = await (await getById(id, 'inventory')).json();

		const inventaryDetails = await (
			await getById(inventary.id, 'inventorydetails')
		).json();

		const config = {
			lowStock: getLowStock(),
		};
		return {
			props: {
				inventary,
				inventaryDetails,
				config,
				ingredients: [],
			},
		};
	} catch (error) {
		return {
			props: { error: 'Ocurrió un error al obtener el inventario', config: {} },
		};
	}
}

export default dynamic(() => Promise.resolve(InventaryById), { ssr: false });
