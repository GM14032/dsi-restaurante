import React from 'react';
import { InventaryTable } from './InventaryTable';
import { formatDate, getDollarFormat } from '@/utils/format';

const InventaryComponent = ({ inventary, config, inventaryDetails = [] }) => {
	return (
		<section className='inventary-component'>
			<div className='inventary-title'>
				<h3>I-{formatDate(inventary?.createAt)}</h3>
			</div>
			<InventaryTable inventaryDetails={inventaryDetails} config={config} />
		</section>
	);
};

export default InventaryComponent;
