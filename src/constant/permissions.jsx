export const PERMISSIONS = {
	READ_USER: ['/pages/usuarios', '/pages/usuarios/[id]'],
	WRITE_USER: ['/pages/usuarios/crear', '/pages/usuarios/actualizar/[id]'],
	READ_ROLE: ['/pages/roles', '/pages/roles/[id]'],
	WRITE_ROLE: ['/pages/roles/crear', '/pages/roles/actualizar/[id]'],
	READ_ORDER: ['/pages/orden', '/pages/orden/[id]', '/pages/orden/history'],
	WRITE_ORDER: ['/pages/orden/crear', '/pages/orden/update/[id]'],
	READ_TABLE: ['/pages/tables', '/pages/tables/[id]'],
	WRITE_TABLE: ['/pages/tables/crear', '/pages/tables/actualizar/[id]'],
	READ_PERMISSION: ['/pages/permisos'],
	WRITE_INVENTARY: [
		'/pages/inventary',
		'/pages/inventary/[id]',
		'/pages/inventary/ingredients',
	],
};
export const NO_PERMISSIONS = ['/login', '/register', '/'];
