import { useEffect, useState } from 'react';
import decode from 'jwt-decode';

export const usePermission = (permission = '') => {
	const [decoded, setDecoded] = useState();

	useEffect(() => {
		if (window && window.localStorage) {
			const token = localStorage.getItem('token');
			if (token) {
				const decoded = decode(token);
				if (decoded !== null) {
					setDecoded(decoded);
				}
			}
		}
	}, []);

	const hasPermission = () => {
		return !!decoded?.permission?.includes(permission);
	};

	return { hasPermission };
};

export default usePermission;
