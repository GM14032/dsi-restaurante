import React from 'react';
import { Col, Row } from 'reactstrap';
import AddTable from './AddTable';

const Step1 = ({ tables, selectTable, tableError, currentTable }) => {
	return (
		<Row>
			<Col xs={12}>
				<AddTable
					tables={tables}
					addValue={selectTable}
					error={tableError}
					value={currentTable}
					showLabel
				/>
				<div
					style={{
						minHeight: '300px',
					}}
				>
					<p className='text-center mt-2'>O</p>
					<div className='tables-step-1 custom-scrollbar'>
						{tables.map((table) => (
							<button
								className='table-item'
								key={table.id}
								onClick={() => {
									selectTable(table);
								}}
								disabled={!table.available}
							>
								<h4 className='text-center'>Mesa #{table.id}</h4>
								<h5>{table.capacity} asientos</h5>
							</button>
						))}
					</div>
				</div>
			</Col>
		</Row>
	);
};

export default Step1;
