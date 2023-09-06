import React, { useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { Button } from 'reactstrap';
import { DefaultModalExample } from '@/Components/ui-common/UiModalCode';
import { formatDate, getDollarFormat } from '@/utils/format';

const IngredientTable = ({
	ingredients = [],
	config: { lowStock = 1, canRemove = false },
	removeItem = (row) => {},
}) => {
	const optional = {
		name: <span className='font-weight-bold fs-13'>Acciones</span>,
		selector: (row) => {
			return (
				<div>
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
	const opColumns = canRemove ? [optional] : [];
	const columns = useMemo(
		() => [
			{
				name: <span className='font-weight-bold fs-13'>Identificador</span>,
				selector: (row) => row?.id,
				sortable: true,
			},
			{
				name: <span className='font-weight-bold fs-13'>Nombre</span>,
				selector: (row) => row?.name,
				sortable: true,
			},
			{
				name: <span className='font-weight-bold fs-13'>Descripcion</span>,
				selector: (row) => row?.description,
				sortable: true,
			},
			{
				name: <span className='font-weight-bold fs-13'>Creado</span>,
				selector: (row) => formatDate(row?.createAt),
				sortable: true,
			},
			{
				name: <span className='font-weight-bold fs-13'>Actualizado</span>,
				selector: (row) => formatDate(row?.updateAt),
				sortable: true,
			},
			{
				name: <span className='font-weight-bold fs-13'>unidad de medida</span>,
				selector: (row) => row?.measureUnit,
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
				data={ingredients}
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

export { IngredientTable };
