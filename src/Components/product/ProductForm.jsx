import { getDollarFormat } from '@/utils/format';
import React from 'react';

const ProductForm = ({ ingredientDetails, removeIngredientDetail, handleQuantity }) => {
	return (
		<>
			<div className='order-form'>
				{ingredientDetails.map((od) => (
					<div key={od.id} className='order-form-item'>
						<div className='order-form-item-name'>
							<i
								className='ri-delete-bin-2-line align-bottom'
								onClick={() => removeIngredientDetail(od)}
							/>
							{od.name}
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
					</div>
				))}
			</div>
		</>
	);
};

export default ProductForm;
