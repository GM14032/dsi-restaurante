import Layout from '@/Layouts';
import React, { useMemo } from 'react';
import BreadCrumb from '@/Components/Common/BreadCrumb';
import {
	Card,
	CardBody,
	CardHeader,
	Col,
	Container,
	Label,
	Row,
} from 'reactstrap';
import 'react-toastify/dist/ReactToastify.css';
import dynamic from 'next/dynamic';
import { getById } from '@/api';
import { getDollarFormat } from '@/utils/format';
import Link from 'next/link';
import DataTable from 'react-data-table-component';

const ShowOrder = ({ order }) => {
	console.log({ order });
	const columns = useMemo(
		() => [
			{
				name: <span className='font-weight-bold fs-13'>Producto</span>,
				selector: (row) => row.product.name,
				sortable: true,
			},
			{
				name: <span className='font-weight-bold fs-13'>Precio</span>,
				selector: (row) => row.product.price,
				sortable: true,
			},
			{
				name: <span className='font-weight-bold fs-13'>Cantidad</span>,
				selector: (row) => row.quantity,
				sortable: true,
			},
			{
				name: <span className='font-weight-bold fs-13'>Total</span>,
				selector: (row) => getDollarFormat(row.total),
				sortable: true,
			},
		],
		[]
	);
	return (
		<Layout title='Nueva orden'>
			<Container fluid>
				<BreadCrumb title='Orden' pageTitle='Pages' />
				<Row>
					<Col xs={12}>
						<Card>
							<CardHeader className='d-flex justify-content-between align-items-center'>
								<h4 className='card-title mb-0'>
									Detalle de orden #{order?.id}
								</h4>
								<Link href='/pages/orden' className='btn btn-primary'>
									<i className='ri-arrow-left-fill align-bottom'></i> Volver
								</Link>
							</CardHeader>
							<CardBody className='card-body'>
								<Card>
									<CardBody>
										<div className='order-data-form'>
											<div className='order-form-group'>
												<Label
													htmlFor='description'
													className='order-form-label'
												>
													Categoria:
												</Label>
												<div
													className='order-form-input'
													style={{ textTransform: 'uppercase' }}
												>
													{order?.category}
												</div>
											</div>
											<div className='order-form-group'>
												<Label
													htmlFor='description'
													className='order-form-label'
												>
													Descripcion:
												</Label>
												<div
													className='order-form-input'
													style={{ textTransform: 'uppercase' }}
												>
													{order?.description}
												</div>
											</div>
											<div className='order-form-group'>
												<Label htmlFor='table' className='order-form-label'>
													Mesa:
												</Label>
												<div className='order-form-input'>
													{order?.tableNumber}
												</div>
											</div>
										</div>
										<div className='order-form'>
											<DataTable
												columns={columns}
												data={order.orderDetails}
												pagination
												paginationPerPage={10}
												paginationRowsPerPageOptions={[10, 15, 20]}
											/>
										</div>
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

export async function getServerSideProps({ params: { id } }) {
	try {
		const order = await (await getById(id, 'orders')).json();
		return {
			props: { order },
		};
	} catch (error) {
		console.log(error);
		return {
			props: { error: 'Ocurrió un error al obtener los productos' },
		};
	}
}

export default dynamic(() => Promise.resolve(ShowOrder), { ssr: false });
