import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import BreadCrumb from '../Components/Common/BreadCrumb';
import dynamic from 'next/dynamic';
import Layout from '@/Layouts';
import {
	Chart as ChartJS,
	ArcElement,
	Tooltip,
	Legend,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
} from 'chart.js';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
	ssr: false,
});
import { Bar } from 'react-chartjs-2';
import Widgets from '@/Components/Common/Widgets';
import { ENGLISH_MONTHS } from '@/constant/months';

ChartJS.register(
	ArcElement,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

const Starter = ({
	summary,
	total,
	totalEarned,
	ordersPerMonths = [],
	totalLastMonth = 0.0,
}) => {
	const series = summary.map((s) => s.quantity);
	const options = {
		labels: summary.map((s) => s.name),
		chart: {
			height: 333,
			type: 'donut',
		},
		legend: {
			position: 'bottom',
		},
		stroke: {
			show: false,
		},
		dataLabels: {
			dropShadow: {
				enabled: false,
			},
		},
		colors: ['#687cfe', '#3cd188', '#ffc107', '#ff6b72', '#00acc1', '#f7666e'],
	};
	const orderText =
		ordersPerMonths.length > 2
			? `Ordenes de ${
					ENGLISH_MONTHS[ordersPerMonths[0].month] || ordersPerMonths[0].month
			  } a ${
					ENGLISH_MONTHS[ordersPerMonths[ordersPerMonths.length - 1].month] ||
					ordersPerMonths[ordersPerMonths.length - 1].month
			  }`
			: 'Ordenes del mes';
	const labelsBar = ordersPerMonths.map(
		(om) => ENGLISH_MONTHS[om.month] || om.month
	);
	const optionsBar = {
		responsive: true,
		plugins: {
			legend: {
				position: 'top',
			},
			title: {
				display: true,
				text: orderText,
			},
		},
	};

	const dataBar = {
		labels: labelsBar,
		datasets: [
			{
				label: 'Cantidad',
				data: ordersPerMonths.map((om) => om.quantity),
				backgroundColor: '#687cfe',
			},
			{
				label: 'Ganancias',
				data: ordersPerMonths.map((om) => om.total),
				backgroundColor: '#3cd188',
			},
		],
	};

	return (
		<Layout title='DSI Restaurant'>
			<Container fluid>
				<BreadCrumb title='Dashboards' pageTitle='Pages' />
				<Row>
					<Col xs={12}>
						<Row>
							<Widgets
								orderTotal={total}
								totalEarned={totalEarned}
								totalLastMonth={totalLastMonth}
							/>
						</Row>
						<div
							style={{
								width: '100%',
								marginTop: '2rem',
								display: 'flex',
								gap: '1rem',
							}}
						>
							<div
								style={{
									width: '40%',
									backgroundColor: 'white',
									padding: '1rem',
									borderRadius: '1rem',
									display: 'flex',
									flexDirection: 'column',
									gap: '1rem',
									alignItems: 'center',
								}}
							>
								<h5 style={{ fontWeight: 'bold' }}>Resumen ordenes del dia</h5>
								<ReactApexChart
									dir='ltr'
									options={options}
									series={series}
									type='donut'
									height='333'
									className='apex-charts'
								/>
							</div>
							<div
								style={{
									width: '60%',
									backgroundColor: 'white',
									padding: '1rem',
									borderRadius: '1rem',
									display: 'flex',
									flexDirection: 'column',
									gap: '1rem',
									alignItems: 'center',
								}}
							>
								<h5 style={{ fontWeight: 'bold' }}>
									Resumen de ordenes por mes
								</h5>
								<Bar options={optionsBar} data={dataBar} />
							</div>
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

		const ordersPerMonths = await (
			await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/orders-by-month`)
		).json();

		const totalEarned = orders.reduce((accOrder, order) => {
			return (
				accOrder +
				order.orderDetails.reduce((acc, detail) => acc + detail.total, 0)
			);
		}, 0);

		const totalLastMonth =
			ordersPerMonths.length > 0
				? ordersPerMonths[ordersPerMonths.length - 1].total
				: 0.0;

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
				totalEarned,
				summary,
				total,
				ordersPerMonths,
				totalLastMonth,
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
