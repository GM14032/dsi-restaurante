/**
 *
 * @param id: number
 * @param body: {[key: string]: any}
 * @returns
 */
export const updateRoles = async (id, body) => {
	return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/roles/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ ...body }),
	});
};
