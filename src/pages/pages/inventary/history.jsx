import React from 'react';
import BreadCrumb from '@/Components/Common/BreadCrumb';
import Layout from '@/Layouts';
import { Container } from 'reactstrap';
import { getAll } from '@/api';
import dynamic from 'next/dynamic';
import { HistoryInv } from '@/Components/inventary/HistoryInv';

const InventaryHistory = ({ inventories = [], config }) => {
	console.log(inventories);

	return (
		<Layout title='Inventario'>
			<Container fluid>
				<BreadCrumb title='Historial de inventario' pageTitle='Pages' />
				<HistoryInv config={config} inventaries={inventories} />
			</Container>
		</Layout>
	);
};

export async function getServerSideProps() {
	try {
		const inventories = await (await getAll('inventory')).json();
		const config = {
			showDetails: true,
		};
		return {
			props: {
				inventories,
				config,
			},
		};
	} catch (error) {
		return {
			props: { error: 'Ocurrió un error al obtener el inventario', config: {} },
		};
	}
}

export default dynamic(() => Promise.resolve(InventaryHistory), { ssr: false });
