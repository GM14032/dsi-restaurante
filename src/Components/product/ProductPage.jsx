import React from 'react';
import { Card, CardBody, CardHeader, Col, Container, Row } from 'reactstrap';
import { TableProducts } from '@/Components/product/TableProduct';
import BreadCrumb from '@/Components/Common/BreadCrumb';
import usePermission from '@/hooks/usePermission';
import useToast from '@/hooks/useToast';
import Layout from '@/Layouts';
import Link from 'next/link';
import 'react-toastify/dist/ReactToastify.css';

export function ProductPage(props) {
	const { hasPermission } = usePermission('WRITE_PRODUCT');
	const { customToast } = useToast();
	const { states = [], allowAdd = true, children, ...res } = props || {};

	return (
		<Layout title='Productos'>
			{customToast}
			<Container fluid>
				<BreadCrumb title='Producto' pageTitle='Pages' />
				<Row>
					<Col lg={12}>
						<Card>
							<CardHeader className='d-flex justify-content-between align-items-center'>
								<h4 className='card-title mb-0 flex-grow-1'>Producto</h4>
								<div className='table-control'>
									{children}
									{hasPermission() && allowAdd && (
										<Link href='/pages/products/crear' className='btn btn-primary'>
											<i className='ri-add-box-line align-bottom'></i> Agregar
										</Link>
									)}
								</div>
							</CardHeader>
							<CardBody>
								<div id='table-gridjs'>
								<TableProducts {...res} />
								</div>
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
		</Layout>
	);
}

export default ProductPage;


