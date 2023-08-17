import React from 'react';

import { Autocomplete, TextField } from '@mui/material';

const AddOrder = ({ products = [], addValue = () => {}, error = '' }) => {
	const onChange = (_, value) => {
		if (value) {
			addValue({ ...value, quantity: 1, total: value.price });
		}
	};

	return (
		<div className='autocomplete-order'>
			<Autocomplete
				disablePortal
				id='orden'
				options={products.map((p) => ({
					...p,
					label: p.name,
				}))}
				onChange={onChange}
				value={null}
				isOptionEqualToValue={(option, value) => option.id === value.id}
				sx={{ width: 300 }}
				renderInput={(params) => <TextField {...params} label='Orden' />}
			/>
			<span>{error}</span>
		</div>
	);
};

export default AddOrder;
