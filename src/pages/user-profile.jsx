import React, { useState } from 'react';

import {
	Container,
	Row,
	Col,
	Card,
	Alert,
	CardBody,
	Button,
	Label,
	Input,
	FormFeedback,
	Form,
} from 'reactstrap';

// Formik Validation
import * as Yup from 'yup';
import { useFormik } from 'formik';

import avatar from '../assets/images/users/avatar-1.jpg';
import Layout from '@/Layouts';
import Image from 'next/image';
import jwt from 'jsonwebtoken';

const UserProfile = () => {
	const [email, setemail] = useState('admin@gmail.com');
	const [idx, setidx] = useState('1');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('update success');
	
	const validation = useFormik({
		// enableReinitialize : use this flag when initial values needs to be changed
		enableReinitialize: true,
		
		initialValues: {
			first_name: userName || 'Admin',
			idx: idx || '',
		},
		validationSchema: Yup.object({
			first_name: Yup.string().required('Please Enter Your UserName'),
		}),
		onSubmit: (values) => {
			console.log(values);
		},
	});

	return (
		<Layout title='Profile | Velzon - React Admin & Dashboard Template'>
			<div className='page-content'>
				<Container fluid>
					<Row>
						<Col lg='12'>
							{error && error ? <Alert color='danger'>{error}</Alert> : null}
							{success ? (
								<Alert color='success'>Username Updated To {userName}</Alert>
							) : null}

							<Card>
								<CardBody>
									<div className='d-flex'>
										<div className='mx-3'>
											<Image
												src={avatar}
												alt=''
												className='avatar-md rounded-circle img-thumbnail'
											/>
										</div>
										<div className='flex-grow-1 align-self-center'>
											<div className='text-muted'>
												<h5>{userName || 'Admin'}</h5>
												<p className='mb-1'>Email Id : {email}</p>
												<p className='mb-0'>Id No : #{idx}</p>
											</div>
										</div>
									</div>
								</CardBody>
							</Card>
						</Col>
					</Row>

					<h4 className='card-title mb-4'>Change User Name</h4>

					<Card>
						<CardBody>
							<Form
								className='form-horizontal'
								onSubmit={(e) => {
									e.preventDefault();
									validation.handleSubmit();
									return false;
								}}
							>
								<div className='form-group'>
									<Label className='form-label'>User Name</Label>
									<Input
										name='first_name'
										// value={name}
										className='form-control'
										placeholder='Enter User Name'
										type='text'
										onChange={validation.handleChange}
										onBlur={validation.handleBlur}
										value={validation.values.first_name || ''}
										invalid={
											validation.touched.first_name &&
											validation.errors.first_name
												? true
												: false
										}
									/>
									{validation.touched.first_name &&
									validation.errors.first_name ? (
										<FormFeedback type='invalid'>
											{validation.errors.first_name}
										</FormFeedback>
									) : null}
									<Input name='idx' value={idx} type='hidden' />
								</div>
								<div className='text-center mt-4'>
									<Button type='submit' color='danger'>
										Update User Name
									</Button>
								</div>
							</Form>
						</CardBody>
					</Card>
				</Container>
			</div>
		</Layout>
	);
};

export default UserProfile;
