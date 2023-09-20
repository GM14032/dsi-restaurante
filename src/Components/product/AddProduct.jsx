import React from 'react';

import { Autocomplete, TextField } from '@mui/material';

const AddProduct = ({ ingredient = [], addValue = () => {}, error = '' }) => {
	const onChange = (_, value) => {
		if (value) {
			addValue({ ...value, quantity: 1 });
		}
	};

	return (
		
		<div className='order-form-input'>			
			<Autocomplete 
				disablePortal
				id='ingredient'
				options={ingredient.map((p) => ({
					...p,
					label: p.name,
				}))}
				onChange={onChange}
				value={null}
				isOptionEqualToValue={(option, value) => option.id === value.id}
				sx={{ width: 707 }}
				renderInput={(params) => <TextField {...params} label='Ingredient' />}
			/>
			<span>{error}</span>
		</div>
	);
};

export default AddProduct;
