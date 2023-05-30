import { useState, useEffect } from 'react';
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
const useGetRequest = (url) => {
  const [data, setData] = useState([]);

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

  useEffect(() => {
    const fetchData = async () => {
      const response = await getRequest(url);
      setData(response);
    };
    fetchData();
  }, [url]);

  return data;
};

export default useGetRequest;