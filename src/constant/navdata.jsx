export const menuItems = [
	{
    		id: 'dashboard',
    		label: 'Dashboards',
    		icon: 'ri-dashboard-2-line',
    		link: '/',
    },
	{
		id: 'usuarios',
		label: 'Gestion de usuarios',
		icon: 'mdi mdi-account-cog',
		subItems: [
			{
				id: 'usuarios',
				label: 'Ver usuarios',
				link: '/pages/usuarios',
				parentId: 'usuarios',
			},
			{
				id: 'usuarios',
				label: 'Agregar usuario',
				link: '/pages/usuarios/crear',
				parentId: 'usuarios',
			},
		],
	},
	,
	{
		id: 'roles',
		label: 'Gestion de roles',
		icon: 'mdi mdi-account-box-multiple',
		subItems: [
			{
				id: 'usuarios',
				label: 'Ver roles',
				link: '/pages/roles',
				parentId: 'roles',
			},
			{
				id: 'usuarios',
				label: 'Agregar rol',
				link: '/pages/roles/crear',
				parentId: 'roles',
			},
		],
	},
	{
		id: 'permisos',
		label: 'Permisos',
		icon: 'mdi mdi-badge-account-horizontal',
		link: '/pages/permisos',
},
];
