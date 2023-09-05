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

const Inventary = ({ inventary, inventaryDetails = [], config }) => {
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
					<InventaryComponent {...inventaryData} config={config} />
				) : (
					<EmptyInventary setNewInventary={setNewInventary} />
				)}
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
