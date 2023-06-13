import { getDollarFormat } from '@/utils/format';
import React from 'react';

const OrderForm = ({ orderDetails, removeOrderDetail, handleQuantity }) => {
	return (
		<>
			<div className='order-form'>
				{orderDetails.map((od) => (
					<div key={od.id} className='order-form-item'>
						<div className='order-form-item-name'>
							<i
								className='ri-delete-bin-2-line align-bottom'
								onClick={() => removeOrderDetail(od)}
							/>
							{od.name}
						</div>
						<div className='order-form-item-price'>
							{getDollarFormat(od.price)} X
						</div>
						<div className='order-form-item-quantity'>
							<input
								type='number'
								placeholder='Cantidad'
								onChange={({ target: { value } }) => handleQuantity(od, value)}
								value={od.quantity}
								autoFocus
							/>
						</div>
						<div className='order-form-item-total'>
							{getDollarFormat(od.total)}
						</div>
					</div>
				))}
			</div>
			<div className='order-form-total'>
				<div className='order-form-item-name'>Total</div>
				<div className='order-form-item-total'>
					{getDollarFormat(orderDetails.reduce((a, b) => a + b.total, 0))}
				</div>
			</div>
		</>
	);
};

export default OrderForm;
