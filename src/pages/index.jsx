import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import BreadCrumb from '../Components/Common/BreadCrumb';
import dynamic from 'next/dynamic';
import Layout from '@/Layouts';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export const data = {
	labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
	datasets: [
		{
			label: '# of Votes',
			data: [12, 19, 3, 5, 2, 3],
			backgroundColor: [
				'rgba(255, 99, 132, 0.2)',
				'rgba(54, 162, 235, 0.2)',
				'rgba(255, 206, 86, 0.2)',
				'rgba(75, 192, 192, 0.2)',
				'rgba(153, 102, 255, 0.2)',
				'rgba(255, 159, 64, 0.2)',
			],
			borderColor: [
				'rgba(255, 99, 132, 1)',
				'rgba(54, 162, 235, 1)',
				'rgba(255, 206, 86, 1)',
				'rgba(75, 192, 192, 1)',
				'rgba(153, 102, 255, 1)',
				'rgba(255, 159, 64, 1)',
			],
			borderWidth: 1,
		},
	],
};

const getPercentage = (quantity, total) => {
	if (total < 1) return '0%';
	if (quantity < 1) return '0%';
	if (quantity > total) return '100%';
	return `${Math.round((quantity / total) * 100)}%`;
};

const Starter = ({ summary, total }) => {
	return (
		<Layout title='DSI Restaurant'>
			<Container fluid>
				<BreadCrumb title='Dashboards' pageTitle='Pages' />
				<Row>
					<Col xs={12}>
						<div className='state-summary'>
							{summary.map((s) => {
								return (
									<div className='state-summary-item' key={s.id}>
										<h5>{s.name}</h5>
										<div
											className='summary-quantity'
											style={{
												'--i': getPercentage(s.quantity, total),
												'--clr': s.colorHex,
											}}
										>
											<h1>{s.quantity}</h1>
										</div>
									</div>
								);
							})}
						</div>
					</Col>
				</Row>
			</Container>
		</Layout>
	);
};

export async function getServerSideProps() {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/order_states/`
		);
		const date = new Date();
		const dateNow = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
			.toISOString()
			.split('T')[0];

		const orders = await (
			await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/orders/?startDate=${dateNow}`
			)
		).json();
		const summaryOrders = orders.reduce((acc, order) => {
			const stateName = order.state.name;
			if (acc[stateName]) {
				return {
					...acc,
					[stateName]: acc[stateName] + 1,
				};
			}
			return {
				...acc,
				[stateName]: 1,
			};
		}, {});
		const total = Object.values(summaryOrders).reduce(
			(acc, quantity) => acc + quantity,
			0
		);
		const states = await response.json();
		const summary = states.map((state) => {
			return {
				...state,
				quantity: summaryOrders[state.name] || 0,
			};
		});
		return {
			props: {
				states: [
					{
						colorHex: '#FF0000',
						id: 0,
						name: 'todos',
					},
					...states,
				],
				summaryOrders,
				summary,
				total,
			},
		};
	} catch (e) {
		return {
			props: {
				states: [],
			},
		};
	}
}

export default dynamic(() => Promise.resolve(Starter), { ssr: false });
