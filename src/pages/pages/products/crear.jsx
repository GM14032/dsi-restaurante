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
} from 'reactstrap';
import 'react-toastify/dist/ReactToastify.css';
import { getAll } from '@/api';
import dynamic from 'next/dynamic';
import AddProduct from '@/Components/product/AddProduct';
import Link from 'next/link';
import useFormProduct from '@/hooks/useFormProduct';
import ProductForm from '@/Components/product/ProductForm';
import { RenderInput } from '@/Components/Common/RenderInput';
import useIngrediente from '@/hooks/useIngrediente';
import AddTable from '@/Components/orden/AddTable';

const createProduct = ({ ingredients = [], error = '' }) => {
	const { ingredientes, currentIngrediente, ingredientError, selectIngredient, setIngredienteError } =
	useIngrediente();
	const {
		addIngredientDetail,
		createProduct,
		getIngredientsThatAreNotInOrderDetails,
		handleQuantity,
		ingredientDetails,
		validation,
		error: errorProduct,
		removeIngredientDetail,
		handleChange,
	} = useFormProduct(ingredients, setIngredienteError);

	return (
		<Layout title='Nueva producto'>
			<Container fluid>
				<BreadCrumb title='Productos' pageTitle='Pages' />
				<Row>
					<Col xs={12}>
						<Card>
							<CardHeader>
								<h4 className='card-title mb-0'>Agregar Productos</h4>
							</CardHeader>
							<CardBody className='card-body'>
								<Card>
									<CardBody>
									<div className='order-form-group'>
												<Label
													htmlFor='description'
													className='order-form-label'
												>
													Nombre de Producto:
												</Label>
												<div className='order-form-input'>
													<RenderInput
														type='text'
														validation={validation}
														fieldName='name'
														placeholder='Ingrese el nombre del producto'
														handleChange={handleChange}
													/>
												</div>
											</div><br></br>
											<div className='order-form-group'>
												<Label
													htmlFor='description'
													className='order-form-label'
												>
													Precio:
												</Label>
												<div className='order-form-input'>
													<RenderInput
														type='number'
														validation={validation}
														fieldName='price'
														placeholder='Ingrese el precio'
														handleChange={handleChange}
													/>
												</div>
											</div><br></br>		
											<div className='order-form-group'>
												<Label
													htmlFor='description'
													className='order-form-label'
												>
													Ingredientes:
												</Label>
												<div className='order-form-input'>
												<AddProduct
											ingredient={getIngredientsThatAreNotInOrderDetails()}
											addValue={addIngredientDetail}
											error={errorProduct}	/>
												</div>											
										</div>
										<ProductForm
											handleQuantity={handleQuantity}
											ingredientDetails={ingredientDetails}
											removeIngredientDetail={removeIngredientDetail}
											validation={validation}
											handleChange={handleChange}
										/>
										<Col lg={11} className='buttons-order-form'>
											<div className='text-end'>
												<Link
													type='button'
													className='btn btn-light btn-lg'
													href='/pages/products'
												>
													Cancelar
												</Link>
												<button
													type='button'
													className='btn btn-primary btn-lg '
													onClick={() => createProduct(currentIngrediente)}
												>
													Guardar
												</button>
											</div>
										</Col>
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

export async function getServerSideProps() {
	try {
		const [ingredients, ingredientDetails] = await Promise.all([
			await (await getAll('ingredients')).json(),
			await (await getAll('ingredientDetails')).json(),
		]);
		return {
			props: { ingredients, ingredientDetails },
		};
	} catch (error) {
		console.log(error);
		return {
			props: { error: 'Ocurrió un error al obtener los ingredientes' },
		};
	}
}

export default dynamic(() => Promise.resolve(createProduct), { ssr: false });
