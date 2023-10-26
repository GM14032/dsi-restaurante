import React from 'react';
import Link from 'next/link';
import { Card, CardBody, Col } from 'reactstrap';
import dynamic from 'next/dynamic';
import useTable from '@/hooks/useTable';
const CountUp = dynamic(() => import('react-countup'), {
	ssr: false,
});

const getPercentage = (total, available) => {
	if (total === 0) return 0;
	return (available * 100) / total;
};

const Widgets = ({ orderTotal, totalEarned }) => {
	const { tables } = useTable('');
	const availables = tables.filter((table) => table.available);
	const ecomWidgets = [
		{
			id: 1,
			cardColor: 'primary',
			label: 'Total Vendido',
			badge: 'ri-arrow-right-up-line',
			badgeClass: 'success',
			counter: totalEarned,
			link: 'Ventas del dia',
			bgcolor: 'secondary',
			icon: 'bx bx-dollar-circle',
			decimals: 2,
			prefix: '$',
			suffix: '',
		},
		{
			id: 2,
			cardColor: 'secondary',
			label: 'Ordenes',
			badge: 'ri-arrow-right-down-line',
			badgeClass: 'danger',
			percentage: '',
			counter: orderTotal,
			link: 'Ver todas las ordenes',
			bgcolor: 'primary',
			icon: 'bx bx-shopping-bag',
			decimals: 0,
			prefix: '',
			separator: ',',
			suffix: '',
			to: '/pages/orden',
		},
		{
			id: 3,
			cardColor: 'success',
			label: 'Total mensual',
			badge: 'ri-arrow-right-up-line',
			badgeClass: 'success',
			percentage: '',
			counter: '183.35',
			link: 'ver todas las ordenes',
			bgcolor: 'success',
			icon: 'bx bx-dollar-circle',
			decimals: 2,
			prefix: '',
			suffix: 'k',
			to: '/pages/orden',
		},
		{
			id: 4,
			cardColor: 'info',
			label: 'Disponibilidad',
			badgeClass: 'muted',
			percentage: '+0.00',
			counter: getPercentage(tables.length, availables.length),
			link: 'Ver mesas',
			bgcolor: 'warning',
			icon: 'bx bx-wallet',
			decimals: 2,
			prefix: '',
			suffix: '%',
			to: '/pages/tables',
		},
	];

	return (
		<React.Fragment>
			{ecomWidgets.map((item, key) => (
				<Col xl={3} md={6} key={key}>
					<Card className='card-animate'>
						<CardBody>
							<div className='d-flex align-items-center'>
								<div className='flex-grow-1 overflow-hidden'>
									<p className='text-uppercase fw-medium text-muted text-truncate mb-0'>
										{item.label}
									</p>
								</div>
								<div className='flex-shrink-0'>
									<h5 className={'fs-14 mb-0 text-' + item.badgeClass}></h5>
								</div>
							</div>
							<div className='d-flex align-items-end justify-content-between mt-4'>
								<div>
									<h4 className='fs-20 fw-semibold ff-secondary mb-4'>
										<span className='counter-value' data-target='125'>
											<CountUp
												start={0}
												prefix={item.prefix}
												suffix={item.suffix}
												separator={item.separator}
												end={item.counter}
												decimals={item.decimals}
												duration={4}
											/>
										</span>
									</h4>
									{item.to ? (
										<Link href={item.to} className='text-decoration-underline'>
											{item.link}
										</Link>
									) : (
										<div>{item.link}</div>
									)}
								</div>
								<div className='avatar-sm flex-shrink-0'>
									<span
										className={
											'avatar-title rounded fs-3 bg-soft-' + item.bgcolor
										}
									>
										<i className={`text-${item.bgcolor} ${item.icon}`}></i>
									</span>
								</div>
							</div>
						</CardBody>
					</Card>
				</Col>
			))}
		</React.Fragment>
	);
};

export default Widgets;
