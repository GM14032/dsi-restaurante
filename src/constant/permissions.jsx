export const PERMISSIONS = {
	READ_USER: ['/pages/usuarios', '/pages/usuarios/[id]'],
	WRITE_USER: ['/pages/usuarios/crear', '/pages/usuarios/actualizar/[id]'],
	READ_ROLE: ['/pages/roles', '/pages/roles/[id]'],
	WRITE_ROLE: ['/pages/roles/crear', '/pages/roles/actualizar/[id]'],
	READ_ORDER: ['/pages/orden', '/pages/orden/[id]'],
	WRITE_ORDER: ['/pages/orden/crear', '/pages/orden/update/[id]'],
};
export const NO_PERMISSIONS = ['/login', '/register', '/'];
