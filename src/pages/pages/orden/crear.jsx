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
import AddOrder from '@/Components/orden/AddOrder';
import Link from 'next/link';
import useFormOrder from '@/hooks/useFormOrder';
import OrderForm from '@/Components/orden/OrderForm';
import { RenderInput } from '@/Components/Common/RenderInput';
import  SelectField  from '@/Components/Common/SelectField';
import { Formik } from "formik";
const CreateOrder = ({ products = [], orderStates = [], error = '' ,tables=[]}) => {
	const {
		addOrderDetail,
		createOrder,
		getProductsThatAreNotInOrderDetails,
		handleQuantity,
		orderDetails,
		validation,
		error: errorOrder,
		removeOrderDetail,
		handleChange,
	} = useFormOrder(products);
	console.log(validation.touched)
	return (
    <Layout title="Nueva orden">
      <Container fluid>
        <BreadCrumb title="Orden" pageTitle="Pages" />
        <Row>
          <Col xs={12}>
            <Card>
              <CardHeader>
                <h4 className="card-title mb-0">Agregar Ordenes</h4>
              </CardHeader>
              <CardBody className="card-body">
                <Card>
				<Formik>
                  <CardBody>
					
                    <div className="order-data-form">
                      <div className="order-form-group">
                        <Label
                          htmlFor="description"
                          className="order-form-label"
                        >
                          Categoria:
                        </Label>
                        <div className="order-form-input">
                          <RenderInput
                            type="text"
                            validation={validation}
                            fieldName="category"
                            placeholder="Ingrese la categoria"
                            handleChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="order-form-group">
                        <Label
                          htmlFor="description"
                          className="order-form-label"
                        >
                          Descripcion:
                        </Label>
                        <div className="order-form-input">
                          <RenderInput
                            type="text"
                            validation={validation}
                            fieldName="description"
                            placeholder="Ingrese la descripcion"
                            handleChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="order-form-group">
                        <Label htmlFor="table" className="order-form-label">
                          Mesa:
                        </Label>
                        <div className="order-form-input">
						<SelectField
                                id="table"
                                name="table"
                                options={tables}
                                onChange={handleChange}
                                value={validation.values.table}
                                touched={validation.touched}
                                errors={validation.errors}
                                label="Selecciona la mesa"
								fieldName='id'
                              />
                        </div>
                      </div>
                    </div>
                    <AddOrder
                      products={getProductsThatAreNotInOrderDetails()}
                      addValue={addOrderDetail}
                      error={errorOrder}
                    />
                    <OrderForm
                      handleQuantity={handleQuantity}
                      orderDetails={orderDetails}
                      removeOrderDetail={removeOrderDetail}
                      validation={validation}
                      handleChange={handleChange}
                    />
                    <Col lg={11} className="buttons-order-form">
                      <div className="text-end">
                        <Link
                          type="button"
                          className="btn btn-light btn-lg"
                          href="/pages/orden"
                        >
                          Cancelar
                        </Link>
                        <button
                          type="button"
                          className="btn btn-primary btn-lg "
                          onClick={createOrder}
                        >
                          Guardar
                        </button>
                      </div>
                    </Col>
					</CardBody>
					</Formik>
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
		const [products, orderStates,tables] = await Promise.all([
			await (await getAll('products')).json(),
			await (await getAll('order_states')).json(),
			await (await getAll('table')).json(),
		]);
		
		return {
			props: { products, orderStates,tables },
		};
	} catch (error) {
		console.log(error);
		return {
			props: { error: 'Ocurrió un error al obtener los productos' },
		};
	}
}

export default dynamic(() => Promise.resolve(CreateOrder), { ssr: false });
