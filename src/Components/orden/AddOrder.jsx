import React, { useRef } from 'react';

import { Autocomplete, TextField } from '@mui/material';

const AddOrder = ({ products = [], addValue = () => {} }) => {
	const ref = useRef();
	const onChange = (_, value) => {
		if (value) {
			addValue({ ...value, quantity: 1, total: value.price });
		}
	};

	return (
		<div className='autocomplete-order' ref={ref}>
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
		</div>
	);
};

export default AddOrder;
