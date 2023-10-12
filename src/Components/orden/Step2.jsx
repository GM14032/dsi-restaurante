import React, { useState } from 'react';
import { Col } from 'reactstrap';
import ProductsOrderTable from './ProductsOrderTable';
import Link from 'next/link';
import Sumary from './Sumary';
import { MenuItem, Select } from '@mui/material';
import useDebounce from '@/hooks/useDebounce';

const Step2 = ({
	products,
	removeOrderDetail,
	addOrderDetail,
	orderDetails,
	currentTable,
	createOrder,
	categories = [],
}) => {
	const [productsFiltered, setProductsFiltered] = useState(() => products);
	const { debounce } = useDebounce();
	const [name, setName] = useState('');
	const [category, setCategory] = useState('-1');

	const filterProducts = (keyword = '', c = category) => {
		const filtered = filterProductsByCategory(c).filter((product) =>
			product.name.toLowerCase().includes(keyword.toLowerCase())
		);
		setProductsFiltered(filtered);
	};

	const filterProductsByCategory = (categoryId) => {
		if (categoryId === '-1') {
			return products;
		}
		const filtered = products.filter(
			(product) => product.category?.id === categoryId
		);
		return filtered;
	};

	const onChange = ({ target: { value } }) => {
		setName(value);
		debounce(() => filterProducts(value), 500);
	};

	return (
		<div>
			<div>
				<h4 className='card-title mb-0 text-center'>Agregar Ordenes</h4>
			</div>
			<div
				className=''
				style={{
					display: 'flex',
					gap: '1rem',
					justifyContent: 'space-between',
				}}
			>
				<div style={{ width: '100%' }}>
					<div
						style={{
							width: '100%',
							display: 'flex',
							gap: '1rem',
							justifyContent: 'space-between',
						}}
					>
						<div
							style={{
								width: '70%',
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'space-between',
							}}
						>
							<label className='form-label'>Buscar por nombre</label>
							<input
								type='text'
								className='form-control'
								placeholder='Buscar Producto'
								onChange={onChange}
								style={{
									borderRadius: '0',
									border: 'none',
									borderBottom: '1px solid #ced4da',
								}}
							/>
						</div>
						<div
							className=''
							style={{
								display: 'flex',
								flexDirection: 'column',
								width: '30%',
								justifyContent: 'space-between',
							}}
						>
							<label className='form-label'>Filtrar por Categoria</label>
							<Select
								labelId='category'
								id='category'
								name='category'
								label='category'
								className='category-filter'
								defaultValue={'-1'}
								onChange={({ target: { value } }) => {
									setCategory(value);
									filterProducts(name, value);
								}}
							>
								<MenuItem value='-1'>
									<em>Todas</em>
								</MenuItem>
								{categories.map((category) => (
									<MenuItem key={category.id} value={category.id}>
										{category.name}
									</MenuItem>
								))}
							</Select>
						</div>
					</div>
					<ProductsOrderTable
						products={productsFiltered}
						removeOrderDetail={removeOrderDetail}
						addOrderDetail={addOrderDetail}
						orderDetails={orderDetails}
					/>
				</div>
				<Sumary orderDetails={orderDetails} />
			</div>
		</div>
	);
};

export default Step2;
