import React from 'react';

import Link from 'next/link';
import { Col, Container, Row } from 'reactstrap';

// Import Images
import error from '../assets/images/error.svg';
import ParticlesAuth from '@/Components/AuthenticationInner/ParticlesAuth';
import Image from 'next/image';

const Basic404 = () => {
	return (
		<ParticlesAuth title='404 Error Basic | Velzon - React Admin & Dashboard Template'>
			<div className='auth-page-content'>
				<Container>
					<Row>
						<Col lg={12}>
							<div className='text-center pt-4'>
								<div className=''>
									<Image
										src={error}
										alt=''
										className='error-basic-img move-animation'
									/>
								</div>
								<div className='mt-n4'>
									<h1 className='display-1 fw-medium'>404</h1>
									<h3 className='text-uppercase'>Sorry, Page not Found 😭</h3>
									<p className='text-muted mb-4'>
										The page you are looking for not available!
									</p>
									<Link href='/dashboard' className='btn btn-secondary'>
										<i className='mdi mdi-home me-1'></i>Back to home
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
