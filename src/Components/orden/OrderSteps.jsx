import React, { useState } from 'react';
import {
	Card,
	CardBody,
	Col,
	Form,
	Nav,
	NavItem,
	NavLink,
	Row,
	TabContent,
	TabPane,
	Progress,
} from 'reactstrap';

import classnames from 'classnames';
import useFormOrder from '@/hooks/useFormOrder';
import useTable from '@/hooks/useTable';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

const OrderSteps = ({ products, orderStates, categories }) => {
	const [activeTab, setactiveTab] = useState(1);
	const [progressbarvalue, setprogressbarvalue] = useState(0);
	const [passedSteps, setPassedSteps] = useState([1]);
	const { tables, currentTable, tableError, selectTable, setTableError } =
		useTable('');
	const [error, setError] = useState('');
	const {
		addOrderDetail,
		createOrder,
		orderDetails,
		validation,
		removeOrderDetail,
		handleChange,
	} = useFormOrder(products, setTableError);

	function toggleTab(tab, value) {
		if (activeTab !== tab) {
			const modifiedSteps = [...passedSteps, tab];

			if (tab >= 1 && tab <= 4) {
				setactiveTab(tab);
				setPassedSteps(modifiedSteps);
			}
		}
		setprogressbarvalue(value);
	}

	return (
		<div>
			<Row>
				<Col xl={12}>
					<Card>
						<CardBody>
							<div className='form-steps'>
								<div className='progress-nav mb-4'>
									<Progress
										value={progressbarvalue}
										style={{ height: '1px' }}
									/>

									<Nav
										className='nav-pills progress-bar-tab custom-nav'
										role='tablist'
									>
										<NavItem>
											<NavLink
												to='#'
												id='pills-gen-info-tab'
												className={classnames(
													{
														active: activeTab === 1,
														done: activeTab <= 4 && activeTab >= 0,
													},
													'rounded-pill'
												)}
												onClick={() => {
													toggleTab(1, 0);
												}}
												tag='button'
											>
												1
											</NavLink>
										</NavItem>
										<NavItem>
											<NavLink
												to='#'
												id='pills-gen-info-tab'
												className={classnames(
													{
														active: activeTab === 2,
														done: activeTab <= 4 && activeTab > 1,
													},
													'rounded-pill'
												)}
												onClick={() => {
													if (currentTable === null) {
														setError(
															'Debe seleccionar una mesa para continuar'
														);
													} else {
														setError('');
														toggleTab(2, 50);
													}
												}}
												tag='button'
											>
												2
											</NavLink>
										</NavItem>
										<NavItem>
											<NavLink
												to='#'
												id='pills-gen-info-tab'
												className={classnames(
													{
														active: activeTab === 3,
														done: activeTab <= 4 && activeTab > 2,
													},
													'rounded-pill'
												)}
												onClick={() => {
													if (Object.keys(orderDetails).length === 0) {
														setError(
															'Debe agregar al menos un producto para continuar'
														);
													} else {
														setError('');
														toggleTab(3, 100);
													}
												}}
												tag='button'
											>
												3
											</NavLink>
										</NavItem>
									</Nav>
								</div>

								<TabContent activeTab={activeTab}>
									<TabPane tabId={1}>
										<div>
											<div className='mb-0'>
												<div className='text-center'>
													<h5 className='mb-1'>Seleccione su mesa</h5>
													<span className='text-danger'>{error}</span>
												</div>
											</div>
											<div>
												<Step1
													{...{
														tables,
														selectTable,
														tableError,
														currentTable,
														validation,
														handleChange,
													}}
												/>
											</div>
										</div>
										<div className='d-flex align-items-start gap-3 mt-4'>
											<button
												type='button'
												className='btn btn-success btn-label right ms-auto nexttab nexttab'
												onClick={() => {
													if (currentTable === null) {
														setError(
															'Debe seleccionar una mesa para continuar'
														);
													} else {
														setError('');
														toggleTab(activeTab + 1, 50);
													}
												}}
											>
												<i className='ri-arrow-right-line label-icon align-middle fs-16 ms-2'></i>
												Siguiente
											</button>
										</div>
									</TabPane>

									<TabPane tabId={2}>
										<div>
											<div className='text-center'>
												<span className='text-danger'>{error}</span>
											</div>
											<Step2
												{...{
													products,
													removeOrderDetail,
													addOrderDetail,
													orderDetails,
													currentTable,
													categories,
												}}
											/>
										</div>
										<div className='d-flex align-items-start gap-3 mt-4'>
											<button
												type='button'
												className='btn btn-link text-decoration-none btn-label previestab'
												onClick={() => {
													toggleTab(activeTab - 1, 0);
												}}
											>
												<i className='ri-arrow-left-line label-icon align-middle fs-16 me-2'></i>{' '}
												Regresar
											</button>
											<button
												type='button'
												className='btn btn-success btn-label right ms-auto nexttab nexttab'
												onClick={() => {
													if (Object.keys(orderDetails).length === 0) {
														setError(
															'Debe agregar al menos un producto para continuar'
														);
													} else {
														setError('');
														toggleTab(activeTab + 1, 100);
													}
												}}
											>
												<i className='ri-arrow-right-line label-icon align-middle fs-16 ms-2'></i>
												Finalizar
											</button>
										</div>
									</TabPane>

									<TabPane tabId={3}>
										<div>
											<div className='text-center'>
												<div className='mb-4'>
													<lord-icon
														src='https://cdn.lordicon.com/lupuorrc.json'
														trigger='loop'
														colors='primary:#0ab39c,secondary:#405189'
														style={{ width: '120px', height: '120px' }}
													></lord-icon>
												</div>
												<h5>Bien hecho!</h5>
												<p className='text-muted'>
													Deseas agregar un comentario?
												</p>
												<Step3
													{...{
														currentTable,
														createOrder,
														orderDetails,
														handleChange,
														validation,
													}}
												/>
											</div>
										</div>
									</TabPane>
								</TabContent>
							</div>
						</CardBody>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default OrderSteps;
