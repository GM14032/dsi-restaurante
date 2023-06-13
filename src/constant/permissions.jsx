export const PERMISSIONS = {
	READ_USER: [ '/pages/usuarios', '/pages/usuarios/[id]'],
	WRITE_USER: ['/pages/usuarios/crear', '/pages/usuarios/actualizar/[id]'],
	READ_ROLE: ['/pages/roles','/pages/roles/[id]'],
	WRITE_ROLE:['/pages/roles/crear', '/pages/roles/actualizar/[id]'],
	READ_ORDER:['/pages/orden','/pages/orden/[id]'],
	WRITE_ORDEN: ['/pages/orden/crear', '/pages/orden/actualizar/[id]'],

};
export const NO_PERMISSIONS = ['/login', '/register', '/'];

