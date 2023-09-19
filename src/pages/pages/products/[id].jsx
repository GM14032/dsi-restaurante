import Layout from '@/Layouts';
import React from 'react';
import BreadCrumb from '@/Components/Common/BreadCrumb';
import {
	Card,
	CardBody,
	CardHeader,
	Col,
	Container,
	Label,
	Row,
	Table,
} from 'reactstrap';
import 'react-toastify/dist/ReactToastify.css';
import dynamic from 'next/dynamic';
import { getById } from '@/api';
import Link from 'next/link';
import TableIngredientesDetail from '@/Components/product/TableIngredientesDetail';
import { getDollarFormat } from '@/utils/format';

const MostrarProduct = ({ product }) => {
	return (
		<Layout title='Nuevo Producto'>
			<Container fluid>
				<BreadCrumb title='Producto' pageTitle='Pages' />
				<Row>
					<Col xs={12}>
						<Card>
							<CardHeader className='d-flex justify-content-between align-items-center'>
								<h4 className='card-title mb-0 custom-card-detail'>
									Detalle del producto #{product?.id}
								</h4>
								<Link href='/pages/products' className='btn btn-primary'>
									<i className='ri-arrow-left-fill align-bottom'></i> Volver
								</Link>
							</CardHeader>
							<CardBody className='card-body'>
								<Card>
									<CardBody>
											<div className='order-form-group'>
												<Label
													htmlFor='description'
													className='order-form-label'
												>
													ID:
												</Label>
												<div
													className='order-form-input'
													style={{ textTransform: 'uppercase' }}
												>
													{product?.id}
												</div>
											</div>
											<div className='order-form-group'>
												<Label
													htmlFor='description'
													className='order-form-label'
												>
													Nombre:
												</Label>
												<div
													className='order-form-input'
													style={{ textTransform: 'uppercase' }}
												>
													{product?.name}
												</div>
											</div>
											<div className='order-form-group'>
												<Label
													htmlFor='description'
													className='order-form-label'
												>
													Precio:
												</Label>
												<div
													className='order-form-input'
													style={{ textTransform: 'uppercase' }}
												>
													{getDollarFormat(product?.price)}
												</div>
											</div>
											<h5 className="card-title mb-3">Ingrediente detalle</h5>
											<div className="table-responsive">
                                <Table className="table-striped table-nowrap align-middle mb-0">
                                  {product && (
                                    <tbody>
                                      <tr>
                                        <th className="ps-0" scope="row">
                                          Cantidad :
                                        </th>
                                        <th className="ps-0" scope="row">
                                          Ingredientes :
                                        </th>
                                      </tr>
                                      {product?.ingredientDetails?.map(
                                        (ingredientDetails) => (
                                          <tr>
                                            <td className="text-muted">
                                              {ingredientDetails.quantity}
                                            </td>
                                            <td className="text-muted">
                                              {ingredientDetails.ingredient.name}
                                            </td>
                                          </tr>
                                        )
                                      )}
                                    </tbody>
                                  )}
                                </Table>
                              </div>
						
									</CardBody>
								</Card>
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
		</Layout>
	);
};

export async function getServerSideProps({ params: { id } }) {
	try {
		const product = await (await getById(id, 'products')).json();
		return {
			props: { product },
		};
	} catch (error) {
		console.log(error);
		return {
			props: { error: 'Ocurrió un error al obtener los productos' },
		};
	}
}

export default dynamic(() => Promise.resolve(MostrarProduct), { ssr: false });
