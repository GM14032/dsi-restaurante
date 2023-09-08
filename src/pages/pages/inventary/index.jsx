import React from 'react';
import BreadCrumb from '@/Components/Common/BreadCrumb';
import Layout from '@/Layouts';
import { Container } from 'reactstrap';
import { getAll, getById } from '@/api';
import dynamic from 'next/dynamic';
import EmptyInventary from '@/Components/inventary/EmptyInventary';
import InventaryComponent from '@/Components/inventary/InventaryComponent';
import { getLowStock } from '@/utils/inventary';

const Inventary = ({ inventary, config, errorMessage = '', details }) => {
	return (
		<Layout title='Inventario'>
			<Container fluid>
				<BreadCrumb title='Inventario' pageTitle='Pages' />
				{inventary ? (
					<InventaryComponent
						inventary={inventary}
						inventaryDetails={details}
						config={config}
					/>
				) : (
					<EmptyInventary showBtn={false} title={errorMessage} />
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

		const details = await (
			await getById(inventary.id, 'inventorydetails/total')
		).json();

		if (details.status === 404) {
			throw new Error('No se encontró el movimiento de inventario');
		}

		const summary = details.map((item) => {
			const ingredient =
				item.ingredientId && item.ingredientName
					? {
							id: item.ingredientId,
							name: item.ingredientName,
							isCountable: true,
					  }
					: {};
			return {
				...item,
				ingredient,
			};
		});

		const config = {
			lowStock: getLowStock(),
			canRemove: false,
			canAdd: false,
			showEntry: false,
		};
		return {
			props: {
				inventary,
				config,
				details: summary,
			},
		};
	} catch (error) {
		return {
			props: {
				error: 'Ocurrió un error al obtener el inventario',
				errorMessage: error.message,
				config: {},
			},
		};
	}
}

export default dynamic(() => Promise.resolve(Inventary), { ssr: false });
