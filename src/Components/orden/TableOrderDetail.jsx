import { getDollarFormat } from '@/utils/format';
import React, { useMemo } from 'react';
import DataTable from 'react-data-table-component';

const TableOrderDetail = ({ orderDetails = [] }) => {
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
		<DataTable
			columns={columns}
			data={orderDetails}
			pagination
			paginationPerPage={10}
			paginationRowsPerPageOptions={[10, 15, 20]}
		/>
	);
};

export default TableOrderDetail;
