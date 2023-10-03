import React, { useEffect, useState } from 'react';
import logoLight from '../../../public/logo-light.png';
import Image from 'next/image';
import { getDollarFormat } from '@/utils/format';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Button, Input } from 'reactstrap';
import { postRequest } from '@/api';

const ORDER = {
	id: 1,
	orderDetails: [],
};

const Ticket = ({ order = ORDER, isModalOpen = false }) => {
	const ticketRef = React.useRef(null);
	const [email, setEmail] = useState('');
	const [disabledSend, setDisabledSend] = useState(false);
	const total = order.orderDetails.reduce(
		(acc, item) => acc + item.quantity * item.product.price,
		0
	);

	useEffect(() => {
		!isModalOpen && setEmail('');
	}, [isModalOpen]);

	const isValidEmail = (email) => {
		const regex = /\S+@\S+\.\S+/;
		return regex.test(email);
	};

	const savePDF = async () => {
		if (!ticketRef.current) return;
		setDisabledSend(true);
		try {
			const doc = new jsPDF();
			const imgCanva = await html2canvas(ticketRef.current);
			const imgData = imgCanva.toDataURL('image/png');
			const xOffset = 23;
			const yOffset = 10;
			doc.addImage(imgData, 'PNG', xOffset, yOffset);
			const pdfBase64 = doc
				.output('datauristring')
				.replace('data:application/pdf;filename=generated.pdf;base64,', '');
			console.log(pdfBase64);
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/orders/invoice`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ pdf: pdfBase64, email }),
				}
			);
			console.log(response.ok);
		} catch (error) {
			console.log(error);
		}
		setDisabledSend(false);
	};
	return (
		<div
			className=''
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '1rem',
			}}
		>
			<div
				className=''
				style={{
					display: 'flex',
					justifyContent: 'space-between',
				}}
			>
				<Input
					type='text'
					placeholder='Email'
					style={{
						width: '70%',
					}}
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				{isValidEmail(email) && (
					<Button
						color='success'
						className='btn-icon'
						onClick={savePDF}
						disabled={disabledSend}
					>
						<i className='bx bxs-send' />
					</Button>
				)}
			</div>
			<div className='ticket-class' ref={ticketRef}>
				<div className='title-ticket'>
					<div>
						<h1>Factura</h1>
						<p>DSI Restaurant</p>
						<p>Ciudad Universitaria</p>
					</div>
					<div className='logo-bg'>
						<Image src={logoLight} alt='' height='17' />
					</div>
				</div>
				<div className='info-ticket'>
					<p>Cliente: </p>
					<p>Email: {email}</p>
				</div>
				<table className='ticket-table'>
					<thead>
						<tr className='header-columns'>
							<th className='header-ticket'>Cantidad</th>
							<th className='header-ticket'>Producto</th>
							<th className='header-ticket'>Precio Unitario</th>
							<th className='header-ticket total-column'>Total</th>
						</tr>
					</thead>
					<tbody>
						{order.orderDetails.map((item) => (
							<tr key={item.id}>
								<td>{item.quantity}</td>
								<td>{item.product.name}</td>
								<td>{getDollarFormat(item.product.price)}</td>
								<td className='total-column'>
									{getDollarFormat(item.quantity * item.product.price)}
								</td>
							</tr>
						))}
					</tbody>
					<tfoot>
						<tr>
							<td colSpan='2' className='text-right'></td>
							<td colSpan='1' className='text-right text-total-column'>
								Subtotal
							</td>
							<td className='total-ticket total-column'>
								{getDollarFormat(total)}
							</td>
						</tr>
						<tr>
							<td colSpan='2' className='text-right'></td>
							<td colSpan='1' className='text-right text-total-column'>
								Propina
							</td>
							<td className='total-ticket total-column'>
								{getDollarFormat(total * 0.1)}
							</td>
						</tr>
						<tr>
							<td colSpan='2' className='text-right'></td>
							<td colSpan='1' className='text-right text-total-column'>
								Total
							</td>
							<td className='total-ticket total-column'>
								{getDollarFormat(total * 1.1)}
							</td>
						</tr>
					</tfoot>
				</table>
			</div>
		</div>
	);
};

export default Ticket;
