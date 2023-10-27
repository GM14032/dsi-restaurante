import { getDollarFormat } from '@/utils/format';
import React from 'react';

const Sumary = ({ orderDetails = [] }) => {
	return (
		<div
			className='col-lg-3'
			style={{
				minHeight: '300px',
				maxHeight: '675px',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
			}}
		>
			<div className='order-details-summary custom-scrollbar'>
				<div className='d-flex justify-content-between align-items-center mb-3'>
					<h5 className='fs-14 text-primary mb-0'>
						<i className='ri-shopping-cart-fill align-middle me-2'></i>
						Tu orden
					</h5>
					{Object.values(orderDetails).length > 0 && (
						<span className='badge bg-danger rounded-pill'>
							{Object.values(orderDetails).length}
						</span>
					)}
				</div>
				<ul className='list-group mb-3'>
					{Object.values(orderDetails).map((orderDetail) => (
						<li className='list-group-item d-flex justify-content-between lh-sm'>
							<div>
								<h6 className='my-0'>{orderDetail.name}</h6>
								<small className='text-muted'>
									Cantidad: {orderDetail.quantity}
								</small>
							</div>
							<span className='text-muted'>
								{getDollarFormat(+orderDetail.quantity * orderDetail.price)}
							</span>
						</li>
					))}
					<li className='list-group-item d-flex justify-content-between'>
						<span>Total (USD)</span>
						<strong>
							{getDollarFormat(
								Object.values(orderDetails).reduce(
									(acc, element) => acc + +element.quantity * element.price,
									0
								)
							)}
						</strong>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default Sumary;
