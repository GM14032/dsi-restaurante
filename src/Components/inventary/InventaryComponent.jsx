import React from 'react';
import { InventaryTable } from './InventaryTable';
import { formatDate } from '@/utils/format';

const InventaryComponent = ({
	inventary,
	config,
	addNewIDetail = () => {},
	inventaryDetails = [],
}) => {
	return (
		<section className='inventary-component'>
			<div className='inventary-title'>
				<h3>I-{formatDate(inventary?.createAt)}</h3>
				{config.canAdd && (
					<button className='btn btn-primary' onClick={addNewIDetail}>
						<i className='ri-add-box-line align-bottom'></i> Agregar
					</button>
				)}
			</div>
			<InventaryTable inventaryDetails={inventaryDetails} config={config} />
		</section>
	);
};

export default InventaryComponent;
