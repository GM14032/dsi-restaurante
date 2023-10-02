import React from 'react';
import logoLight from '../../../public/logo-light.png';
import Image from 'next/image';
import { getDollarFormat } from '@/utils/format';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ORDER = {
	id: 1,
	orderDetails: [
		{
			id: 1,
			product: {
				id: 1,
				name: 'Pizza',
				price: 15,
				quantity: 2,
			},
		},
		{
			id: 2,
			product: {
				id: 2,
				name: 'Hamburguesa',
				price: 10,
				quantity: 1,
			},
		},
	],
};

const Ticket = ({ order = ORDER }) => {
	const ticketRef = React.useRef(null);
	const total = order.orderDetails.reduce(
		(acc, item) => acc + item.product.quantity * item.product.price,
		0
	);
	const savePDF = async () => {
		if (!ticketRef.current) return;
		try {
			const doc = new jsPDF();
			const imgCanva = await html2canvas(ticketRef.current);
			const imgData = imgCanva.toDataURL('image/png');
			const xOffset = 23;
			const yOffset = 10;
			doc.addImage(imgData, 'PNG', xOffset, yOffset);
			const pdfBase64 = doc.output('datauristring');
			console.log('PDF guardado como base64:', pdfBase64);
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<div>
			<button onClick={savePDF}>Create pdf</button>
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
					<p>Cliente: name surnamme</p>
					<p>Email: name@gmail.com</p>
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
								<td>{item.product.quantity}</td>
								<td>{item.product.name}</td>
								<td>{getDollarFormat(item.product.price)}</td>
								<td className='total-column'>
									{getDollarFormat(item.product.quantity * item.product.price)}
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
