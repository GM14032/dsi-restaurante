import React from 'react';
import { Card, CardBody, CardHeader, Col, Container, Row } from 'reactstrap';
import { TableOrders } from '@/Components/orden/TableOrder';
import BreadCrumb from '@/Components/Common/BreadCrumb';
import usePermission from '@/hooks/usePermission';
import useToast from '@/hooks/useToast';
import dynamic from 'next/dynamic';
import Layout from '@/Layouts';
import Link from 'next/link';
import 'react-toastify/dist/ReactToastify.css';

function Orden() {
	const { hasPermission } = usePermission('WRITE_ORDER');
	const { customToast } = useToast();

	return (
		<Layout title='Ordenes'>
			{customToast}
			<Container fluid>
				<BreadCrumb title='Orden' pageTitle='Pages' />
				<Row>
					<Col lg={12}>
						<Card>
							<CardHeader className='d-flex justify-content-between align-items-center'>
								<h4 className='card-title mb-0 flex-grow-1'>Orden</h4>
								<div>
									{hasPermission() && (
										<Link href='/pages/orden/crear' className='btn btn-primary'>
											<i className='ri-add-box-line align-bottom'></i> Agregar
										</Link>
									)}
								</div>
							</CardHeader>
							<CardBody>
								<div id='table-gridjs'>
									<TableOrders />
								</div>
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
		</Layout>
	);
}

export default dynamic(() => Promise.resolve(Orden), { ssr: false });
