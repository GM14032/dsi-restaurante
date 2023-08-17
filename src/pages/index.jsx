import React, { useRef, useState, Suspense } from 'react';
import { Col, Container, Row } from 'reactstrap';
import BreadCrumb from '../Components/Common/BreadCrumb';
import dynamic from 'next/dynamic';
import Layout from '@/Layouts';
import { useSubscription } from 'react-stomp-hooks';
import { StompSessionProvider } from 'react-stomp-hooks';

const Starter = () => {
	const [message, setMessage] = useState('Your server message here.');

	/*useSubscription('/topic/message', (msg) => {
		const { message } = JSON.parse(msg.body) || {};
		console.log(message);
		setMessage(message);
	});
*/
	return (
		<Layout title='DSI | Restaurante'>
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
