import React from 'react';
import { InventaryTable } from './InventaryTable';
import { formatDate } from '@/utils/format';
import BtnCreateInventary from './BtnCreateInventary';

const InventaryComponent = ({
	inventary,
	config,
	addNewIDetail = () => {},
	inventaryDetails = [],
	createInventaryFromZero = () => {},
	handleModalDelete = () => {},
	preTitle = 'Inventario #',
}) => {
	return (
		<section className='inventary-component'>
			<div className='inventary-title'>
				<h3>
					{preTitle} I-{formatDate(inventary?.createAt)}
				</h3>
				{config.canAdd && (
					<div style={{ display: 'flex', gap: '1rem' }}>
						<div
							style={{
								position: 'relative',
							}}
						>
							<BtnCreateInventary
								createInventaryFromZero={createInventaryFromZero}
								inventary={inventary}
							/>
						</div>
						<button className='btn btn-primary' onClick={addNewIDetail}>
							<i className='ri-add-box-line align-bottom'></i> Agregar
						</button>
					</div>
				)}
			</div>
			<InventaryTable
				inventaryDetails={inventaryDetails}
				config={config}
				removeItem={handleModalDelete}
			/>
		</section>
	);
};

export default InventaryComponent;
