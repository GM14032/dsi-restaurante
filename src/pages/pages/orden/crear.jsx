import Layout from '@/Layouts';
import React, { useState } from 'react';
import BreadCrumb from '@/Components/Common/BreadCrumb';
import { Card, CardBody, CardHeader, Col, Container, Row } from 'reactstrap';
import 'react-toastify/dist/ReactToastify.css';
import { getAll } from '@/api';
import dynamic from 'next/dynamic';
import AddOrder from '@/Components/orden/AddOrder';
import { getDollarFormat } from '@/utils/format';
import Link from 'next/link';
import useFormOrder from '@/hooks/useFormOrder';
import OrderForm from '@/Components/orden/OrderForm';

const CreateOrder = ({ products = [], orderStates = [], error = '' }) => {
	const {
		addOrderDetail,
		createOrder,
		getProductsThatAreNotInOrderDetails,
		handleQuantity,
		orderDetails,
		removeOrderDetail,
	} = useFormOrder(products);

	return (
		<Layout title='Nueva orden'>
			<Container fluid>
				<BreadCrumb title='Orden' pageTitle='Pages' />
				<Row>
					<Col xs={12}>
						<Card>
							<CardHeader>
								<h4 className='card-title mb-0'>Agregar Ordenes</h4>
							</CardHeader>
							<CardBody className='card-body'>
								<Card>
									<CardBody>
										<AddOrder
											products={getProductsThatAreNotInOrderDetails()}
											addValue={addOrderDetail}
										/>
										<OrderForm
											handleQuantity={handleQuantity}
											orderDetails={orderDetails}
											removeOrderDetail={removeOrderDetail}
										/>
										<Col lg={11} className='buttons-order-form'>
											<div className='text-end'>
												<Link
													type='button'
													className='btn btn-light btn-lg'
													href='/pages/orden'
												>
													Cancelar
												</Link>
												<button
													type='button'
													className='btn btn-primary btn-lg '
													onClick={createOrder}
												>
													Guardar
												</button>
											</div>
										</Col>
									</CardBody>
								</Card>
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
		</Layout>
	);
};

export async function getServerSideProps() {
	try {
		const [products, orderStates] = await Promise.all([
			await (await getAll('products')).json(),
			await (await getAll('order_states')).json(),
		]);
		return {
			props: { products, orderStates },
		};
	} catch (error) {
		console.log(error);
		return {
			props: { error: 'Ocurrió un error al obtener los productos' },
		};
	}
}

export default dynamic(() => Promise.resolve(CreateOrder), { ssr: false });
