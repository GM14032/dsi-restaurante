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
{
	id: 'Orden',
	label: 'Gestion de ordenes',
	icon: 'mdi mdi-file-table-box-multiple',
	subItems: [
		{
			id: 'Orden',
			label: 'Ver Ordenes',
			link: '/pages/orden',
			parentId: 'Orden',
		},
		{
			id: 'Orden',
			label: 'Agregar Orden',
			link: '/pages/orden/crear',
			parentId: 'Orden',
		},
	],
},
{
	id: 'Table',
	label: 'Gestion de Mesas',
	icon: 'mdi mdi-file-table-box-multiple',
	subItems: [
		{
			id: 'Table',
			label: 'Ver Mesas',
			link: '/pages/tables',
			parentId: 'tables',
		},
		{
			id: 'Table',
			label: 'Agregar Mesa',
			link: '/pages/tables/crear',
			parentId: 'table',
		},
	],
},
];
