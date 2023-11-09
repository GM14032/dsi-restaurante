import React, { useState, useEffect, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { DefaultModalExample } from '@/Components/ui-common/UiModalCode';
import Link from 'next/link';
import decode from 'jwt-decode';
import { putRequest, getAll } from '@/api';
import { getDollarFormat } from '@/utils/format';

const TableIngredients = ({ stateSelected = 0, startDate = '', endDate = '' }) => {
	const [ingredients, setIngredients] = useState([]);
	const [ingredientFiltered, setIngredientFiltered] = useState([]);
	const [dataLoaded, setDataLoaded] = useState(false);
	const [selectedIngredient, setSelectedIngredient] = useState(null);
	const [modal_standard, setmodal_standard] = useState(false);
	const [decoded, setDecoded] = useState();
	const [hasPermission, setHasPermission] = useState({
		deleteIngredient: false,
		updateIngredient: false,
	});
	const fetchIngredients = async () => {
		try {
			setDataLoaded(false);
			const responseIngredients = await getAll('ingredients', `${startDate}${endDate}`);
			const data = await responseIngredients.json();
			setIngredients(data);
		} catch (error) {
			setIngredients([]);
		} finally {
			setDataLoaded(true);
		}
	};

	useEffect(() => {
		fetchIngredients();
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
			const deleteIngredient = decoded.permission.includes('DELETE_INGREDIENT');
			const updateIngredient = decoded.permission.includes('WRITE_INGREDIENT');
			setHasPermission({ ...hasPermission, deleteIngredient, updateIngredient });
		}
	}, [decoded]);
	const handleInactivateIngredient = async () => {
		if (selectedIngredient) {
			var enable = true;
			const id = selectedIngredient.id;
			if (selectedIngredient.enable) enable = false;
			const response = await putRequest(
				id,
				{
					enable: enable,
				},
				'ingredients'
			);

			if (response.ok) {
				const body = response.json();
				console.log(body);
				setmodal_standard(false);
				fetchIngredients();
			} else {
				const errorBody = response.json();
				console.log(errorBody);
			}
		}
	};
    useEffect(() => {
		setIngredientFiltered(
			ingredients.filter(
				(ingredient) => ingredient.id === stateSelected || !stateSelected
			)
		);
	}, [ingredients, stateSelected]);
	const columns = useMemo(
		() => [
			{
				name: <span className='font-weight-bold fs-13'>Id de ingrediente</span>,
				selector: (row) => row.id,
				sortable: true,
			},
			{
				name: <span className='font-weight-bold fs-13'>Name</span>,
				selector: (row) => row.name,
				sortable: true,
			},
            {
				name: <span className='font-weight-bold fs-13'>Descripcion</span>,
				selector: (row) => row.description,
				sortable: true,
			},
            {
				name: <span className='font-weight-bold fs-13'>Unidad</span>,
				selector: (row) => row.unit,
				sortable: true,
			},
			{
				name: <span className='font-weight-bold fs-13'>Acciones</span>,
				selector: (row) => {
					return (
						<div>
							{hasPermission.updateIngredient && (
								<>
									<Link
										href={`/pages/ingredient/${row.id}`}
										style={{ marginRight: '8px' }}
									>
										<Button color='info' className='btn-icon' title='Ver producto'>
											<i className='bx bxs-show' />
										</Button>
									</Link>
									<Link href={`/pages/ingredient/actualizar/${row.id}`}>
										<Button
											color='success'
											className='btn-icon'
											title='Actualizar ingrediente'
										>
											<i className=' bx bxs-edit' />{' '}
										</Button>
									</Link>
								</>
							)}
							 {hasPermission.deleteIngredient && (
                <>
                  <Button
                    color={row.enable ? "danger" : "warning"}
                    className="btn-icon"
                    title={row.enable ? "Inactivar Producto" : "Activar Producto"}
                    onClick={() => {
                      tog_standard();
                      setSelectedIngredient(row);
                    }}
                  >
                    <i
                      className={`bx bx-${row.enable ? "x" : "plus"}-circle`}
                    />
                  </Button>{" "}
                </>
              )}{" "}
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
					data={ingredientFiltered}
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
						{selectedIngredient?.enable ? 'Inactivar ' : 'Activar '}Orders
					</ModalHeader>
					<ModalBody>
						<h5 className='fs-15'>
							¿Desea {selectedIngredient?.enable ? 'inactivar ' : 'activar '}el rol{' '}
							<b>{selectedIngredient?.name}</b>?
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
						<Button color='primary' onClick={handleInactivateIngredient}>
							Aceptar
						</Button>
					</div>
				</Modal>
			</div>
		)
	);
};

export { TableIngredients };
