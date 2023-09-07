import React from 'react';

import {
	Autocomplete,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
} from '@mui/material';
import { Label } from 'reactstrap';

const AddTable = ({ tables = [], value, addValue = () => {}, error = '' }) => {
	const onChange = ({ target: { value } }) => {
		const table = tables.find((table) => table.id === value);
		addValue(table);
	};

	return (
		<div
			className='order-form-group order-form-select'
			style={{
				alignItems: 'end',
			}}
		>
			<Label htmlFor='table' className='order-form-label'>
				Mesa:
			</Label>
			<FormControl variant='standard' sx={{ m: 1, minWidth: 120 }}>
				<InputLabel id='order_state'>Mesa</InputLabel>
				<Select
					labelId='table'
					id='table'
					name='table'
					label='table'
					value={value?.id || ''}
					onChange={onChange}
				>
					{tables.map((table) => (
						<MenuItem key={table.id} value={table.id}>
							{`Mesa #${table.id}: ${table.capacity} asientos`}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</div>
	);
};

export default AddTable;
