import React, { useState, useEffect, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { DefaultModalExample } from '@/Components/ui-common/UiModalCode';
import Link from 'next/link';
import decode from 'jwt-decode';
import { getAll } from '@/api';
import { getDollarFormat } from '@/utils/format';
import Ticket from '../ticket/Ticket';

const TableOrders = ({
	stateSelected = 0,
	startDate = '',
	endDate = '',
	orderStates = [],
}) => {
	const [orders, setOrders] = useState([]);
	const [orderFiltered, setOrderFiltered] = useState([]);
	const [dataLoaded, setDataLoaded] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState(null);
	const [modal_standard, setmodal_standard] = useState(false);
	const [decoded, setDecoded] = useState();
	const [hasPermission, setHasPermission] = useState({
		deleteOrder: false,
		updateOrder: false,
	});
	const fetchOrders = async () => {
		try {
			setDataLoaded(false);
			const responseOrders = await getAll('orders', `${startDate}${endDate}`);
			const data = await responseOrders.json();
			setOrders(data);
		} catch (error) {
			setOrders([]);
		} finally {
			setDataLoaded(true);
		}
	};

	useEffect(() => {
		fetchOrders();
	}, [startDate, endDate]);
	useEffect(() => {
		if (window && window.localStorage) {
			const token = localStorage.getItem('token');
			if (token) {
				const decoded = decode(token);
				if (decoded !== null) {
					setDecoded(decoded);
				}
			}
		}
	}, []);
	useEffect(() => {
		if (decoded) {
			const deleteOrder = decoded.permission.includes('DELETE_ORDER');
			const updateOrder = decoded.permission.includes('WRITE_ORDER');
			setHasPermission({ ...hasPermission, deleteOrder, updateOrder });
		}
	}, [decoded]);

	const updateStateOrder = (id, state) => {
		const orders = orderFiltered.map((order) => {
			if (order.id === id) {
				return { ...order, state };
			}
			return order;
		});
		setOrderFiltered(orders);
		tog_standard();
	};

	const printer = (data) => {
		setSelectedOrder(data);
		tog_standard();
	};

	useEffect(() => {
		setOrderFiltered(
			orders.filter(
				(order) => order.state.id === stateSelected || !stateSelected
			)
		);
	}, [orders, stateSelected]);

	const columns = useMemo(
		() => [
			{
				name: <span className='font-weight-bold fs-13'>Numero de Orden</span>,
				selector: (row) => row.numberOrder,
				sortable: true,
			},
			{
				name: <span className='font-weight-bold fs-13'># Mesa</span>,
				selector: (row) => row.table?.id,
				sortable: true,
			},
			{
				name: <span className='font-weight-bold fs-13'>Total</span>,
				selector: (row) => getDollarFormat(row.total),
				sortable: true,
			},
			{
				name: <span className='font-weight-bold fs-13'>Fecha</span>,
				selector: (row) => row.create_at,
				sortable: true,
			},
			{
				name: <span className='font-weight-bold fs-13'>Estado</span>,
				selector: (row) => (
					<span
						className={`badge badge-soft-success fs-13`}
						style={{
							backgroundColor: row?.state?.colorHex,
							color: 'white',
							fontWeight: 'bold',
						}}
					>
						{row?.state?.name}
					</span>
				),
				sortable: true,
			},
			{
				name: <span className='font-weight-bold fs-13'>Acciones</span>,
				selector: (row) => {
					return (
						<div>
							{hasPermission.updateOrder && (
								<>
									<Link
										href={`/pages/orden/${row.id}`}
										style={{ marginRight: '8px' }}
									>
										<Button color='info' className='btn-icon' title='Ver orden'>
											<i className='bx bxs-show' />
										</Button>
									</Link>
									{row.state.name !== 'Pagado' && (
										<>
											<Link href={`/pages/orden/update/${row.id}`}>
												<Button
													color='success'
													className='btn-icon'
													title='Actualizar orden'
												>
													<i className=' bx bxs-edit' />
												</Button>
											</Link>
											{orderStates.length > 0 && (
												<Button
													color='success'
													className='btn-icon'
													title='Actualizar orden'
													style={{ marginLeft: '8px' }}
													onClick={() => {
														printer(row);
													}}
												>
													<i className='bx bxs-printer' />
												</Button>
											)}
										</>
									)}
								</>
							)}
						</div>
					);
				},

				sortable: true,
			},
		],
		[hasPermission]
	);

	function tog_standard() {
		setmodal_standard(!modal_standard);
	}

	return (
		dataLoaded && (
			<div>
				<DataTable
					columns={columns}
					data={orderFiltered}
					pagination
					paginationPerPage={10}
					paginationRowsPerPageOptions={[10, 15, 20]}
				/>
				<div className='d-none code-view'>
					<pre className='language-markup' style={{ height: '275px' }}>
						<DefaultModalExample />
					</pre>
				</div>
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
							order={selectedOrder}
							isModalOpen={modal_standard}
							orderStates={orderStates}
							updateStateOrder={updateStateOrder}
						/>
					</ModalBody>
				</Modal>
			</div>
		)
	);
};

export { TableOrders };
