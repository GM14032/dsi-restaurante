import decode from 'jwt-decode';

export const getAccessToken = () => {
	const token = localStorage.getItem('token');
	if (token) {
		const { exp } = decode(token);
		if (Date.now() >= exp * 1000) {
			localStorage.removeItem('token');
			return '';
		}
		return token;
	}
	return '';
};
.selectAnt
		width: 50% !important;
const getRequest = async (url) => {
	const token = getAccessToken();
	const response = await fetch(url, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	const data = await response.json();
	return data;
};

const postRequest = async (url, body) => {
	const token = getAccessToken();
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	});
	const data = await response.json();
	return data;
};

const putRequest = async (url, body) => {
	const token = getAccessToken();
	const response = await fetch(url, {
		method: 'PUT',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	});
	const data = await response.json();
	return data;
};