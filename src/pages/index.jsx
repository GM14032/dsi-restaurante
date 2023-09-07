import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import BreadCrumb from '../Components/Common/BreadCrumb';
import dynamic from 'next/dynamic';
import Layout from '@/Layouts';

const Starter = () => {
	return (
		<Layout title='DSI Restaurant'>
			<Container fluid>
				<BreadCrumb title='Starter' pageTitle='Pages' />
				<Row>
					<Col xs={12}>
						<div className='page-title-box d-flex align-items-center justify-content-between'>
							<h4 className='mb-0 font-size-18'>Dashboards</h4>
						</div>
					</Col>
				</Row>
			</Container>
		</Layout>
	);
};
export default dynamic(() => Promise.resolve(Starter), { ssr: false });
