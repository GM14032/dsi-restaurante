import { getAll } from '@/api';
import { useEffect, useState } from 'react';

export const useTable = () => {
	const [tables, setTables] = useState([]);
	const [currentTable, setCurrentTable] = useState(null);
	const [tableError, setTableError] = useState('');

	const fetchTables = async () => {
		const response = await getAll('table', '?available=true');
		const data = await response.json();
		setTables(data);
	};

	useEffect(() => {
		fetchTables();
	}, []);

	const selectTable = (table) => {
		setCurrentTable(table);
		if (table) {
			setTableError('');
		}
	};

	return { tables, currentTable, tableError, setTableError, selectTable };
};

export default useTable;
