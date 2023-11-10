import React, { useState, useEffect, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { DefaultModalExample } from '@/Components/ui-common/UiModalCode';
import Link from 'next/link';
import decode from 'jwt-decode';
import { putRequest, getAll } from '@/api';
import { getDollarFormat } from '@/utils/format';

const TableProducts = ({ stateSelected = 0, startDate = '', endDate = '' }) => {
	const [products, setProducts] = useState([]);
	const [productFiltered, setProductFiltered] = useState([]);
	const [dataLoaded, setDataLoaded] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [modal_standard, setmodal_standard] = useState(false);
	const [decoded, setDecoded] = useState();
	const [hasPermission, setHasPermission] = useState({
		deleteProduct: false,
		updateProduct: false,
	});
	const fetchProducts = async () => {
		try {
			setDataLoaded(false);
			const responseProducts = await getAll('products', `${startDate}${endDate}`);
			const data = await responseProducts.json();
			setProducts(data);
		} catch (error) {
			setProducts([]);
		} finally {
			setDataLoaded(true);
		}
	};

	useEffect(() => {
		fetchProducts();
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
			const deleteProduct = decoded.permission.includes('DELETE_PRODUCT');
			const updateProduct = decoded.permission.includes('WRITE_PRODUCT');
			setHasPermission({ ...hasPermission, deleteProduct, updateProduct });
		}
	}, [decoded]);
	const handleInactivateProduct = async () => {
		if (selectedProduct) {
			var enable = true;
			const id = selectedProduct.id;
			if (selectedProduct.enable) enable = false;
			const response = await putRequest(
				id,
				{
					enable: enable,
				},
				'products'
			);

			if (response.ok) {
				const body = response.json();
				console.log(body);
				setmodal_standard(false);
				fetchProducts();
			} else {
				const errorBody = response.json();
				console.log(errorBody);
			}
		}
	};
    useEffect(() => {
		setProductFiltered(
			products.filter(
				(product) => product.id === stateSelected || !stateSelected
			)
		);
	}, [products, stateSelected]);
	const columns = useMemo(
		() => [
			{
				name: <span className='font-weight-bold fs-13'>Id de Producto</span>,
				selector: (row) => row.id,
				sortable: true,
			},
			{
				name: <span className='font-weight-bold fs-13'>Name</span>,
				selector: (row) => row.name,
				sortable: true,
			},
			{
				name: <span className='font-weight-bold fs-13'>Precio</span>,
				selector: (row) => getDollarFormat(row.price),
				sortable: true,
			},
			{
				name: <span className='font-weight-bold fs-13'>Acciones</span>,
				selector: (row) => {
					return (
						<div>
							{hasPermission.updateProduct && (
								<>
									<Link
										href={`/pages/products/${row.id}`}
										style={{ marginRight: '8px' }}
									>
										<Button color='info' className='btn-icon' title='Ver producto'>
											<i className='bx bxs-show' />
										</Button>
									</Link>
									
								</>
							)}
							 {hasPermission.deleteProduct && (
                <>
                  <Button
                    color={row.enable ? "danger" : "warning"}
                    className="btn-icon"
                    title={row.enable ? "Inactivar Producto" : "Activar Producto"}
                    onClick={() => {
                      tog_standard();
                      setSelectedProduct(row);
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
					data={productFiltered}
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
						{selectedProduct?.enable ? 'Inactivar ' : 'Activar '}Orders
					</ModalHeader>
					<ModalBody>
						<h5 className='fs-15'>
							¿Desea {selectedProduct?.enable ? 'inactivar ' : 'activar '}el rol{' '}
							<b>{selectedProduct?.name}</b>?
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
						<Button color='primary' onClick={handleInactivateProduct}>
							Aceptar
						</Button>
					</div>
				</Modal>
			</div>
		)
	);
};

export { TableProducts };
