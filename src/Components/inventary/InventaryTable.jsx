import React, { useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { DefaultModalExample } from '@/Components/ui-common/UiModalCode';
import Link from 'next/link';
import { getDollarFormat } from '@/utils/format';

const InventaryTable = ({
	inventaryDetails = [],
	config: { lowStock = 1 },
}) => {
	const columns = useMemo(
		() => [
			{
				name: <span className='font-weight-bold fs-13'>Ingrediente</span>,
				selector: (row) => row?.ingredient?.name,
				sortable: true,
			},
			{
				name: <span className='font-weight-bold fs-13'>Cantidad</span>,
				selector: (row) => (
					<span
						style={{
							color: row?.quantity <= lowStock ? 'red' : 'black',
							fontWeight: 'bold',
						}}
					>
						{row?.quantity}
					</span>
				),
				sortable: true,
			},
			{
				name: <span className='font-weight-bold fs-13'>Precio unitario</span>,
				selector: (row) => getDollarFormat(row.price),
				sortable: true,
			},
			{
				name: <span className='font-weight-bold fs-13'>Total</span>,
				selector: (row) =>
					getDollarFormat((row.price || 0) * (row.quantity || 0)),
				sortable: true,
			},
			{
				name: <span className='font-weight-bold fs-13'>Estado</span>,
				selector: (row) => (
					<span
						className={`badge badge-soft-success fs-13`}
						style={{
							backgroundColor: row?.isEntry ? '#3cd188' : '#0ac7fb',
							color: 'white',
							fontWeight: 'bold',
						}}
					>
						{row?.isEntry ? 'Entrada' : 'Salida'}
					</span>
				),
				sortable: true,
			},
		],
		[]
	);

	return (
		<div>
			<DataTable
				columns={columns}
				data={inventaryDetails}
				pagination
				paginationPerPage={10}
				paginationRowsPerPageOptions={[10, 15, 20]}
			/>
			<div className='d-none code-view'>
				<pre className='language-markup' style={{ height: '275px' }}>
					<DefaultModalExample />
				</pre>
			</div>
		</div>
	);
};

export { InventaryTable };
