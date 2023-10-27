import React from 'react';
import { getDollarFormat } from '@/utils/format';
import DataTable from 'react-data-table-component';
import { Button } from 'reactstrap';

const ProductsOrderTable = ({
	products,
	removeOrderDetail,
	addOrderDetail,
	orderDetails,
}) => {
	const columns = [
		{
			name: <span className='font-weight-bold fs-13'>Nombre</span>,
			selector: (row) => row.name,
			sortable: true,
		},
		{
			name: <span className='font-weight-bold fs-13'>Categoria</span>,
			selector: (row) => row.category?.name || '',
			sortable: true,
		},
		{
			name: <span className='font-weight-bold fs-13'>Precio</span>,
			selector: (row) => getDollarFormat(row.price),
			sortable: true,
		},
		{
			name: <span className='font-weight-bold fs-13'>Acciones</span>,
			selector: (row) => (
				<div
					style={{
						width: '100px',
						height: '30px',
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						backgroundColor: '#05597B',
						color: 'white',
						borderRadius: '5px',
					}}
				>
					<Button
						color='info'
						className='btn-icon'
						title='Agregar a la orden'
						onClick={() => {
							removeOrderDetail(row);
						}}
						style={{
							borderTopLeftRadius: '5px',
							borderBottomLeftRadius: '5px',
							backgroundColor: '#960018',
							width: '30px',
							border: 'none',
						}}
						disabled={!orderDetails[row.id]}
					>
						<i className='bx bx-minus' style={{}} />
					</Button>
					<span>{orderDetails[row.id]?.quantity || 0}</span>
					<Button
						className='btn-icon'
						title='Agregar a la orden'
						onClick={() => {
							addOrderDetail(row);
						}}
						style={{
							borderTopRightRadius: '5px',
							borderBottomRightRadius: '5px',
							backgroundColor: '#034e68',
							width: '30px',
							border: 'none',
						}}
					>
						<i className='bx bx-plus' style={{}} />
					</Button>
				</div>
			),
			sortable: false,
		},
	];

	return (
		<>
			<div>
				<DataTable
					columns={columns}
					data={products}
					pagination
					paginationPerPage={10}
					paginationRowsPerPageOptions={[10, 15, 20]}
				/>
			</div>
		</>
	);
};

export default ProductsOrderTable;
