/**
 *
 * @param id: number
 * @param body: {[key: string]: any}
 * @param path: string
 * @returns
 */
//
export const putRequest = async (id, body,path) => {
	return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${path}/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ ...body }),
	});
};
//
export const getById = async (id,path) => {
	return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${path}/${id}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});
};
//
export const postRequest = async ( body,path) => {
	return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${path}/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ ...body }),
	});
};
//
export const getAll = async (path ) => {
	return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${path}/`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});
};
