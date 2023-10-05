import Layout from '@/Layouts';
import React, { useState } from 'react';
import BreadCrumb from '@/Components/Common/BreadCrumb';
import {
	Card,
	CardBody,
	CardHeader,
	Col,
	Container,
	FormFeedback,
	Label,
	Modal,
	ModalBody,
	ModalHeader,
	Row,
} from 'reactstrap';
import 'react-toastify/dist/ReactToastify.css';
import { getAll, getById } from '@/api';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { RenderInput } from '@/Components/Common/RenderInput';
import useUpdateOrder from '@/hooks/useUpdateOrder';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import TableOrderDetail from '@/Components/orden/TableOrderDetail';
import Ticket from '@/Components/ticket/Ticket';

const CreateOrder = ({
	products = [],
	orderStates = [],
	error = '',
	order,
}) => {
	const { createOrder, validation, tables, handleChange } = useUpdateOrder(
		products,
		order,
		orderStates
	);
	const [modal_standard, setmodal_standard] = useState(false);

	const updateStateOrder = () => {
		createOrder();
		tog_standard();
	};

	function tog_standard() {
		if (!modal_standard) {
			const state = orderStates.find((s) => s.name === 'Pagado');
			if (state) {
				const fieldName = {
					target: {
						name: 'order_state',
						value: state.id,
					},
				};
				handleChange(fieldName);
			}
		} else {
			const fieldName = {
				target: {
					name: 'order_state',
					value: order.state.id,
				},
			};
			handleChange(fieldName);
		}
		setmodal_standard(!modal_standard);
	}
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
											<div className='order-form-group order-form-select'>
												<Label htmlFor='table' className='order-form-label'>
													Mesa:
												</Label>
												<FormControl
													variant='standard'
													sx={{ m: 1, minWidth: 120 }}
												>
													<InputLabel id='order_state'># de mesa</InputLabel>
													<Select
														labelId='table'
														id='table'
														name='table'
														value={
															validation.values && validation.values['table']
																? validation.values['table']
																: ''
														}
														onChange={handleChange}
														label='table'
														disabled={true}
													>
														{tables.map((table) => (
															<MenuItem key={table.id} value={`${table.id}`}>
																{`Mesa #${table.id}: ${table.capacity} asientos`}
															</MenuItem>
														))}
													</Select>
													{validation.errors['table'] && (
														<FormFeedback type='invalid'>
															{validation.errors['table']}
														</FormFeedback>
													)}
												</FormControl>
											</div>
											<div className='order-form-group order-form-select'>
												<Label htmlFor='table' className='order-form-label'>
													Estado de orden:
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
														disabled={order?.state?.name === 'Pagado'}
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
										<TableOrderDetail orderDetails={order.orderDetails} />
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
													className='btn btn-primary btn-lg'
													onClick={createOrder}
												>
													Guardar
												</button>
												{order?.state?.name !== 'Pagado' && (
													<button
														type='button'
														className='btn btn-primary btn-lg ml-2'
														onClick={tog_standard}
														style={{
															marginLeft: '10px',
														}}
													>
														Pagar
													</button>
												)}
											</div>
										</Col>
									</CardBody>
								</Card>
							</CardBody>
						</Card>
					</Col>
				</Row>
				<Modal
					id='myModal'
					isOpen={modal_standard}
					toggle={() => {
						tog_standard();
					}}
					style={{ maxWidth: '535px' }}
				>
					<ModalHeader
						className='modal-title'
						id='myModalLabel'
						toggle={() => {
							tog_standard();
						}}
					>
						Factura
					</ModalHeader>
					<ModalBody>
						<Ticket
							order={order}
							isModalOpen={modal_standard}
							orderStates={orderStates}
							updateStateOrder={updateStateOrder}
						/>
					</ModalBody>
				</Modal>
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
