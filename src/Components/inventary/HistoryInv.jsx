import React, { useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { Button } from 'reactstrap';
import { DefaultModalExample } from '@/Components/ui-common/UiModalCode';
import Link from 'next/link';
import { formatDate } from '@/utils/format';

const HistoryInv = ({
	inventaries = [],
	config: { canRemove = false, showDetails = false },
	removeItem = (row) => {},
}) => {
	const optional = {
		name: <span className='font-weight-bold fs-13'>Acciones</span>,
		selector: (row) => {
			return (
				<div>
					{showDetails && (
						<Link
							href={`/pages/inventary/${row.id}`}
							style={{ marginRight: '8px' }}
						>
							<Button color='info' className='btn-icon' title='Ver orden'>
								<i className='bx bxs-show' />
							</Button>
						</Link>
					)}
					{canRemove && (
						<Button
							color='danger'
							className='btn-icon'
							title='Eliminar detalle'
							onClick={() => {
								removeItem(row);
							}}
						>
							<i className={`bx bx-x-circle`} />
						</Button>
					)}
				</div>
			);
		},
	};
	const opColumns = canRemove || showDetails ? [optional] : [];
	const columns = useMemo(
		() => [
			{
				name: <span className='font-weight-bold fs-13'>Identificador</span>,
				selector: (row) => row?.id,
				sortable: true,
			},
			{
				name: <span className='font-weight-bold fs-13'>Creado</span>,
				selector: (row) => formatDate(row?.createAt),
				sortable: true,
			},
			{
				name: (
					<span className='font-weight-bold fs-13'>Ultima actualizacion</span>
				),
				selector: (row) => formatDate(row?.updateAt),
				sortable: true,
			},
			{
				name: <span className='font-weight-bold fs-13'>Activo</span>,
				selector: (row) => (
					<span
						className={`badge badge-soft-success fs-13`}
						style={{
							backgroundColor:
								row?.isActive || row?.active ? '#3cd188' : '#C51e3a',
							color: 'white',
							fontWeight: 'bold',
						}}
					>
						{row?.isActive || row?.active ? 'Activo' : 'Inactivo'}
					</span>
				),
				sortable: true,
			},
			...opColumns,
		],
		[]
	);

	return (
		<div>
			<DataTable
				columns={columns}
				data={inventaries}
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

export { HistoryInv };
