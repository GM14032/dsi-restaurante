import React, { useState, useEffect } from 'react';
import BreadCrumb from '@/Components/Common/BreadCrumb';
import Layout from '@/Layouts';
import { Container } from 'reactstrap';
import { getAll } from '@/api';
import dynamic from 'next/dynamic';
import EmptyInventary from '@/Components/inventary/EmptyInventary';
import InventaryComponent from '@/Components/inventary/InventaryComponent';
import AddInventoryDetails from '@/Components/inventary/AddInventoryDetails';
import { IngredientTable } from '@/Components/inventary/ingredients/IngredientTable';

const Ingredients = ({ config, ingredients = [] }) => {
	const [ingredientsData, setIngredientsData] = useState({
		ingredients: [],
	});
	const [openModal, setOpenModal] = useState(false);

	const openModalHandler = () => setOpenModal(!openModal);
	const closeModalHandler = () => setOpenModal(false);

	useEffect(() => {
		if (ingredients) {
			setIngredientsData({
				...ingredientsData,
				ingredients,
			});
		}
	}, [ingredients]);

	const setNewIngredient = (ingredient) => {
		setIngredientsData({
			...ingredientsData,
			ingredients: [ingredient, ...ingredientsData.ingredients],
		});
	};

	return (
		<Layout title='Inventario'>
			<Container fluid>
				<BreadCrumb title='Inventario' pageTitle='Pages' />
				{ingredientsData.ingredients && (
					<IngredientTable
						ingredients={ingredientsData.ingredients}
						config={config}
					/>
				)}
			</Container>
		</Layout>
	);
};

export async function getServerSideProps() {
	try {
		const ingredients = await (await getAll('ingredients')).json();
		const config = {
			canRemove: true,
			canAdd: true,
			canUpdate: true,
		};
		return {
			props: { config, ingredients },
		};
	} catch (error) {
		return {
			props: {
				error: 'Ocurrió un error al obtener los ingredientes',
				config: {},
			},
		};
	}
}

export default dynamic(() => Promise.resolve(Ingredients), { ssr: false });
