import React, { useState, useEffect, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { DefaultModalExample } from '@/Components/ui-common/UiModalCode';
import Link from 'next/link';
import decode from 'jwt-decode';
import { putRequest, getAll } from '@/api';

const TableOrders = () => {
	const [orders, setOrders] = useState([]);
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
			const responseOrders = await getAll('orders');
			const data = await responseOrders.json();
			setOrders(data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchOrders();
		setDataLoaded(true);
	}, []);
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
	const handleInactivateOrder = async () => {
		if (selectedOrder) {
			var enable = true;
			const id = selectedOrder.id;
			if (selectedOrder.enable) enable = false;
			const response = await putRequest(
				id,
				{
					enable: enable,
				},
				'Orders'
			);

			if (response.ok) {
				const body = response.json();
				console.log(body);
				setmodal_standard(false);
				fetchOrders();
			} else {
				const errorBody = response.json();
				console.log(errorBody);
			}
		}
	};

	const columns = useMemo(
		() => [
			{
				name: <span className='font-weight-bold fs-13'>Numero de Orden</span>,
				selector: (row) => row.id,
				sortable: true,
			},
			{
				name: <span className='font-weight-bold fs-13'>Categoria</span>,
				selector: (row) => row.category,
				sortable: true,
			},
			{
				name: <span className='font-weight-bold fs-13'>Nombre</span>,
				selector: (row) => row.name,
				sortable: true,
			},
			{
				name: <span className='font-weight-bold fs-13'>Cantidad</span>,
				selector: (row) => row.quantity,
				sortable: true,
			},
			{
				name: <span className='font-weight-bold fs-13'>Estado</span>,
				selector: (row) => (
					<span
						className={`badge badge-soft-${
							row.state ? 'success' : 'danger'
						} fs-13`}
					>
						{row.state ? 'Activo' : 'Inactivo'}
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
									<Link href={`/pages/Orders/actualizar/${row.id}`}>
										<Button
											color='success'
											className='btn-icon'
											title='Actualizar rol'
										>
											{' '}
											<i className=' bx bxs-edit' />{' '}
										</Button>
									</Link>
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
					data={orders}
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
				>
					<ModalHeader
						className='modal-title'
						id='myModalLabel'
						toggle={() => {
							tog_standard();
						}}
					>
						{selectedOrder?.enable ? 'Inactivar ' : 'Activar '}Orders
					</ModalHeader>
					<ModalBody>
						<h5 className='fs-15'>
							¿Desea {selectedOrder?.enable ? 'inactivar ' : 'activar '}el rol{' '}
							<b>{selectedOrder?.name}</b>?
						</h5>
					</ModalBody>
					<div className='modal-footer'>
						<Button
							color='light'
							onClick={() => {
								tog_standard();
							}}
						>
							Cancelar
						</Button>
						<Button color='primary' onClick={handleInactivateOrder}>
							Aceptar
						</Button>
					</div>
				</Modal>
			</div>
		)
	);
};

export { TableOrders };
