import { getAll } from '@/api';
import { useEffect, useState } from 'react';

export const useIngrediente = (available = '?available=true') => {
	const [ingredientes, setIngredientes] = useState([]);
	const [currentIngrediente, setCurrentIngrediente] = useState(null);
	const [ingredienteError, setIngredienteError] = useState('');

	const fetchIngredientes = async () => {
		const response = await getAll('ingredients', available);
		const dataI = await response.json();
		setIngredientes(dataI);
	};

	useEffect(() => {
		fetchIngredientes();
	}, []);

	const selectIngredient = (ingredient) => {
		setCurrentIngrediente(ingredient);
		if (ingredient) {
			setIngredienteError('');
		}
	};

	return { ingredientes, currentIngrediente, ingredienteError, setIngredienteError, selectIngredient };
};

export default useIngrediente;