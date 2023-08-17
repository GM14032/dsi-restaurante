import React from 'react';
import { Col, Container, Row } from 'reactstrap';

const Footer = ({ className = '' }) => {
	return (
		<React.Fragment>
			<footer className={`footer ${className}`}>
				<Container fluid>
					<Row>
						<Col sm={6}>{new Date().getFullYear()} © DSI.</Col>
						<Col sm={6}>
							<div className='text-sm-end d-none d-sm-block'>
								Grupo 5
							</div>
						</Col>
					</Row>
				</Container>
			</footer>
		</React.Fragment>
	);
};

export default Footer;
