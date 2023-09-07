import React from 'react';

import { Autocomplete, TextField } from '@mui/material';

const AddTable = ({ tables = [], value, addValue = () => {}, error = '' }) => {
	const onChange = (_, value) => {
		addValue(value);
	};

	return (
		<div className='autocomplete-order'>
			<Autocomplete
				disablePortal
				id='table'
				options={tables.map((p) => ({
					...p,
					label: `Mesa #${p.id}: ${p.capacity} asientos`,
				}))}
				onChange={onChange}
				value={value}
				isOptionEqualToValue={(option, value) => option.id === value.id}
				sx={{ width: 300 }}
				renderInput={(params) => <TextField {...params} label='Mesa' />}
			/>
			<span>{error}</span>
		</div>
	);
};

export default AddTable;
