import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Col, Container, Row } from 'reactstrap';
import { TableOrders } from '@/Components/orden/TableOrder';
import BreadCrumb from '@/Components/Common/BreadCrumb';
import usePermission from '@/hooks/usePermission';
import useToast from '@/hooks/useToast';
import dynamic from 'next/dynamic';
import Layout from '@/Layouts';
import Link from 'next/link';
import 'react-toastify/dist/ReactToastify.css';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

function Orden(props) {
	const { hasPermission } = usePermission('WRITE_ORDER');
	const { customToast } = useToast();
	const { states = []} = props || {};
	const [stateSelected, setStateSelected] = useState(0);

	return (
		<Layout title='Ordenes'>
			{customToast}
			<Container fluid>
				<BreadCrumb title='Orden' pageTitle='Pages' />
				<Row>
					<Col lg={12}>
						<Card>
							<CardHeader className='d-flex justify-content-between align-items-center'>
								<h4 className='card-title mb-0 flex-grow-1'>Orden</h4>
								<div className='table-control'>
									<FormControl>
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
									{hasPermission() && (
										<Link href='/pages/orden/crear' className='btn btn-primary'>
											<i className='ri-add-box-line align-bottom'></i> Agregar
										</Link>
									)}
								</div>
							</CardHeader>
							<CardBody>
								<div id='table-gridjs'>
									<TableOrders stateSelected={stateSelected} />
								</div>
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
		</Layout>
	);
}

export default dynamic(() => Promise.resolve(Orden), { ssr: false });

export async function getServerSideProps(){
	try{
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order_states/`);
		const states = await response.json();
		return {
			props: {
				states: [{
					colorHex: "#FF0000",
					id: 0,
					name: "todos"},
					...states
				],
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
