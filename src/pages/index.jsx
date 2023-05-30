import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import BreadCrumb from '../Components/Common/BreadCrumb';
import dynamic from "next/dynamic";
import Layout from '@/Layouts';

const Starter = () => {
	return (
		<Layout title='DSI | Restaurante'>
			<Container fluid>
				<BreadCrumb title='Starter' pageTitle='Pages' />
				<Row>
					<Col xs={12}></Col>
				</Row>
			</Container>
		</Layout>
	);
};
export default dynamic(() => Promise.resolve(Starter), { ssr: false });
