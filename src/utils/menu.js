import jwtDecode from 'jwt-decode';
import { PERMISSIONS } from '@/constant/permissions';
import { menuItems } from '@/constant/navdata';
/**
 *
 * @param {String[]} permission
 * @param {String} url
 */
const isValidUrl = (permission, url) => {
	const hasPermission = permission.some((p) =>
		(PERMISSIONS[p] || []).includes(url)
	);
	// if the url is not in permission I will let it pass
	const isFreeAccess = Object.values(PERMISSIONS)
		.flat()
		.every((p) => p !== url);
	return hasPermission || isFreeAccess;
};
/**
 *
 * @returns {String[]}
 */
const getPermissions = () => {
	if (!localStorage) return [];
	const token = localStorage.getItem('token');
	if (token) {
		const decoded = jwtDecode(token);
		if (decoded) {
			return decoded.permission || [];
		}
	}
	return [];
};

const getSubItems = (permissions, item) => {
	const subItems = [];
	//validamos que tenga subitems
	if (item.subItems) {
		item.subItems.forEach((subItem) => {
			if (isValidUrl(permissions, subItem.link)) {
				// ingresamos el array de todas las rutas validas
				subItems.push(subItem);
			}
		});
	}
	return subItems;
};

/**
 *
 * @param {String[]} permission
 * @param {{link?: string;}} item
 * @returns any
 */
export const getMenu = () => {
	const permissions = getPermissions();
	const menu = [];
	menuItems.forEach((item) => {
		// verificamos si es un separador
		if (item.separator) {
			menu.push(item);
			return;
		}
		// si tiene link y es valido lo mostraremos en el menu, caso contrario significa que podria tener subitems
		if (item.link && isValidUrl(permissions, item.link)) {
			menu.push(item);
			return;
		}
		// buscando subitems
		const subItems = getSubItems(permissions, item);
		if (subItems.length > 0) {
			// actualizamos el item con los subitems validos
			menu.push({ ...item, subItems });
		}
	});

	return menu;
};
