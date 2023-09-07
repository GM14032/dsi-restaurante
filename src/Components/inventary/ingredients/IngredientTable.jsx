import React, { useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { Button } from 'reactstrap';
import { DefaultModalExample } from '@/Components/ui-common/UiModalCode';
import { formatDate } from '@/utils/format';

const IngredientTable = ({
	ingredients = [],
	config: { canRemove = false, canUpdate = false, canAdd = false },
	removeItem = (row) => {},
	updateItem = (row) => {},
	addNewItem = () => {},
}) => {
	const optional = {
		name: <span className='font-weight-bold fs-13'>Acciones</span>,
		selector: (row) => {
			return (
				<div style={{ display: 'flex', gap: '8px' }}>
					{canUpdate && (
						<Button
							color='primary'
							className='btn-icon'
							title='Editar detalle'
							onClick={() => {
								updateItem(row);
							}}
						>
							<i className={`bx bx-edit-alt`} />
						</Button>
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
				selector: (row) => row?.unit,
				sortable: true,
			},
			...opColumns,
		],
		[]
	);

	return (
		<div className='inventary-component'>
			<div className='inventary-title'>
				<h3>Ingredientes</h3>
				{canAdd && (
					<button className='btn btn-primary' onClick={addNewItem}>
						<i className='ri-add-box-line align-bottom'></i> Agregar
					</button>
				)}
			</div>
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
