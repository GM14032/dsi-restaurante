import Layout from '@/Layouts';
import React from 'react';
import BreadCrumb from '@/Components/Common/BreadCrumb';
import { Container } from 'reactstrap';
import 'react-toastify/dist/ReactToastify.css';
import { getAll } from '@/api';
import dynamic from 'next/dynamic';
import OrderSteps from '@/Components/orden/OrderSteps';

const CreateOrder = ({
	products = [],
	categories = [],
	orderStates = [],
	error = '',
}) => {
	return (
		<Layout title='Nueva orden'>
			<Container fluid>
				<BreadCrumb title='Orden' pageTitle='Pages' />
				<OrderSteps
					categories={categories}
					products={products}
					orderStates={orderStates}
				/>
			</Container>
		</Layout>
	);
};

export async function getServerSideProps() {
	try {
		const [products, orderStates, categories] = await Promise.all([
			await (await getAll('products')).json(),
			await (await getAll('order_states')).json(),
			await (await getAll('category')).json(),
		]);
		return {
			props: { products, orderStates, categories },
		};
	} catch (error) {
		console.log(error);
		return {
			props: { error: 'Ocurrió un error al obtener los productos' },
		};
	}
}

export default dynamic(() => Promise.resolve(CreateOrder), { ssr: false });
