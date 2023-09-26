import { getDollarFormat } from '@/utils/format';
import React, { useMemo } from 'react';
import DataTable from 'react-data-table-component';

const TableIngredientesDetail = ({ ingredieteDetails = [] }) => {
	const columns = useMemo(
		() => [
			{
				name: <span className='font-weight-bold fs-13'>Cantidad</span>,
				selector: (row) => row.quantity,
				sortable: true,
			},
			{
				name: <span className='font-weight-bold fs-13'>Ingrediente</span>,
				selector: (row) => row.ingredientDetails.name,
				sortable: true,
			},
			{
				name: <span className='font-weight-bold fs-13'>Producto</span>,
				selector: (row) => row.product.name,
				sortable: true,
			},
		],
		[]
	);
	return (
		<DataTable
			columns={columns}
			data={ingredieteDetails}
			pagination
			paginationPerPage={10}
			paginationRowsPerPageOptions={[10, 15, 20]}
		/>
	);
};

export default TableIngredientesDetail;