import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-toastify/dist/ReactToastify.css';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import OrderPage from "@/Components/orden/OrdenPage";

function Order(props) {
	const { states = [], startDate = ''} = props || {};
	const [stateSelected, setStateSelected] = useState(0);

	return (
		<OrderPage startDate={startDate}>
			<FormControl stateSelected={stateSelected}>
				<InputLabel id='demo-simple-select-label'>
					Estado
				</InputLabel>
				<Select
					labelId='demo-simple-select-label'
					id='demo-simple-select'
					value={stateSelected}
					label='Estado'
					className='simple-select-order'
					onChange={(e) => {
						setStateSelected(e.target.value);
					}}
				>
					{
						states.map(state=>(
							<MenuItem key={state.id} name={state.name} value={state.id}>{state.name}</MenuItem>)
						)
					}
				</Select>
			</FormControl>
		</OrderPage>
	);
}

export default dynamic(() => Promise.resolve(Order), { ssr: false });

export async function getServerSideProps(){
	try{
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order_states/`);
		const states = await response.json();
		const date = new Date();
		// remove the offset time
		const dateNow = new Date(
			date.getTime() - date.getTimezoneOffset() * 60000
		)
			.toISOString()
			.split('T')[0];
		return {
			props: {
				states: [{
					colorHex: "#FF0000",
					id: 0,
					name: "todos"},
					...states
				],
				startDate: `?startDate=${dateNow}`,
			}
		};
	}catch (e){
		return {
			props: {
				states: [],
			}
		}
	}
}
