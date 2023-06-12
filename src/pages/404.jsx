import React from 'react';

import Link from 'next/link';
import { Col, Container, Row } from 'reactstrap';

// Import Images
import error from '../assets/images/error.svg';
import ParticlesAuth from '@/Components/AuthenticationInner/ParticlesAuth';
import Image from 'next/image';

const Basic404 = () => {
	return (
		<ParticlesAuth title='404 Error'>
			<div className='auth-page-content'>
				<Container>
					<Row>
						<Col lg={12}>
						<div className='text-center mt-sm-5 pt-4 mb-4'> 	
								<div className=''>
									<Image
										src={error}
										alt=''
										height='230'
										className='move-animation'
									/>
								</div>
								<div className='mb-5'>
								<h1 className='display-2 coming-soon-text'>404</h1>
								</div>
								<div className='mt-n4'>
								
									<h3 className='text-uppercase'>Lo siento, La pagina no fue encontrada 😭</h3>
									<p className='text-muted mb-4'>
									La página que buscas no está disponible o el recurso no existe!
									</p>
									<Link href='/' className='btn btn-secondary'>
										<i className='mdi mdi-home me-1'></i>Regresar a home
									</Link>
								</div>
							</div>
						</Col>
					</Row>
				</Container>
			</div>
		</ParticlesAuth>
	);
};

export default Basic404;
