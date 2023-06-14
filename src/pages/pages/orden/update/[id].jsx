import Layout from '@/Layouts';
import React from 'react';
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
import { getAll, getById } from '@/api';
import dynamic from 'next/dynamic';
import AddOrder from '@/Components/orden/AddOrder';
import Link from 'next/link';
import OrderForm from '@/Components/orden/OrderForm';
import { RenderInput } from '@/Components/Common/RenderInput';
import useUpdateOrder from '@/hooks/useUpdateOrder';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const CreateOrder = ({
	products = [],
	orderStates = [],
	error = '',
	order,
}) => {
	const {
		addOrderDetail,
		createOrder,
		getProductsThatAreNotInOrderDetails,
		handleQuantity,
		orderDetails,
		validation,
		error: errorOrder,
		removeOrderDetail,
		handleChange,
	} = useUpdateOrder(products, order);

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
										<div className='order-data-form'>
											<div className='order-form-group'>
												<Label
													htmlFor='description'
													className='order-form-label'
												>
													Categoria:
												</Label>
												<div className='order-form-input'>
													<RenderInput
														type='text'
														validation={validation}
														fieldName='category'
														placeholder='Ingrese la categoria'
														handleChange={handleChange}
													/>
												</div>
											</div>
											<div className='order-form-group'>
												<Label
													htmlFor='description'
													className='order-form-label'
												>
													Descripcion:
												</Label>
												<div className='order-form-input'>
													<RenderInput
														type='text'
														validation={validation}
														fieldName='description'
														placeholder='Ingrese la descripcion'
														handleChange={handleChange}
													/>
												</div>
											</div>
											<div className='order-form-group'>
												<Label htmlFor='table' className='order-form-label'>
													Mesa:
												</Label>
												<div className='order-form-input'>
													<RenderInput
														type='text'
														validation={validation}
														fieldName='table'
														placeholder='Ingrese el numero de mesa'
														handleChange={handleChange}
													/>
												</div>
											</div>
											<div className='order-form-group order-form-select'>
												<Label htmlFor='table' className='order-form-label'>
													Mesa:
												</Label>
												<FormControl
													variant='standard'
													sx={{ m: 1, minWidth: 120 }}
												>
													<InputLabel id='order_state'>order state</InputLabel>
													<Select
														labelId='order_state'
														id='order_state'
														name='order_state'
														value={
															validation.values &&
															validation.values['order_state']
																? validation.values['order_state']
																: ''
														}
														onChange={handleChange}
														label='Order State'
													>
														{orderStates.map((orderState) => (
															<MenuItem
																key={orderState.id}
																value={orderState.id}
															>
																{orderState.name}
															</MenuItem>
														))}
													</Select>
												</FormControl>
											</div>
										</div>
										<AddOrder
											products={getProductsThatAreNotInOrderDetails()}
											addValue={addOrderDetail}
											error={errorOrder}
										/>
										<OrderForm
											handleQuantity={handleQuantity}
											orderDetails={orderDetails}
											removeOrderDetail={removeOrderDetail}
											validation={validation}
											handleChange={handleChange}
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

export async function getServerSideProps({ params: { id } }) {
	try {
		const order = Number.isInteger(+id)
			? await (await getById(id, 'orders')).json()
			: {};
		const [products, orderStates] = await Promise.all([
			await (await getAll('products')).json(),
			await (await getAll('order_states')).json(),
		]);
		return {
			props: { products, orderStates, order },
		};
	} catch (error) {
		return {
			props: { error: 'Ocurrió un error al obtener los productos' },
		};
	}
}

export default dynamic(() => Promise.resolve(CreateOrder), { ssr: false });
