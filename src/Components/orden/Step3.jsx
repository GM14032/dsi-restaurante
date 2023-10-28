import React from 'react';
import Sumary from './Sumary';

const Step3 = ({
	currentTable,
	createOrder,
	orderDetails,
	handleChange,
	validation,
}) => {
	return (
		<div
			style={{
				width: '100%',
				display: 'flex',
				gap: '1rem',
				justifyContent: 'space-between',
				padding: '1rem',
			}}
		>
			<div
				className=''
				style={{
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					gap: '1rem',
				}}
			>
				<h4 className='card-title mb-0 text-center'>
					Mesa #{currentTable?.id}
				</h4>
				<textarea
					name='description'
					id='description'
					cols='30'
					rows='10'
					placeholder='Comentarios de la orden'
					style={{
						padding: '1rem',
						borderRadius: '10px',
						outline: 'none',
					}}
					onChange={handleChange}
					value={
						validation.values && validation.values['description']
							? validation.values['description']
							: ''
					}
				></textarea>
				<button
					onClick={() => {
						createOrder(currentTable);
					}}
					className='btn btn-success btn-label right nexttab nexttab'
					style={{
						textTransform: 'uppercase',
						fontSize: '1rem',
					}}
				>
					Finalizar orden
				</button>
			</div>
			<Sumary orderDetails={orderDetails} />
		</div>
	);
};

export default Step3;
