export const menuItems = [
	{
		id: 'dashboard',
		label: 'Dashboards',
		icon: 'ri-dashboard-2-line',
		link: '/',
	},
	{
		label: 'Pages',
		isHeader: true,
	},
	{
		id: 'usuarios',
		label: 'Gestion de usuarios',
		icon: 'mdi mdi-account-cog',
		subItems: [
			{
				id: 'usuarios-display',
				label: 'Ver usuarios',
				link: '/pages/usuarios',
				parentId: 'usuarios',
			},
			{
				id: 'usuarios-add',
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
				id: 'usuarios-display-role',
				label: 'Ver roles',
				link: '/pages/roles',
				parentId: 'roles',
			},
			{
				id: 'usuarios-add-role',
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
		label: 'Operaciones de Negocio',
		isHeader: true,
	},
	{
		id: 'Orden',
		label: 'Gestion de ordenes',
		icon: 'mdi mdi-file-table-box-multiple',
		subItems: [
			{
				id: 'Orden-display',
				label: 'Ver Ordenes',
				link: '/pages/orden',
				parentId: 'Orden',
			},
			{
				id: 'Orden-add',
				label: 'Agregar Orden',
				link: '/pages/orden/crear',
				parentId: 'Orden',
			},
			{
				id: 'historial',
				label: 'Historial',
				link: '/pages/orden/history',
				parentId: 'Orden',
			},
		],
	},
	{
		id: 'Table',
		label: 'Gestion de Mesas',
		icon: 'mdi mdi-table-chair',
		subItems: [
			{
				id: 'Table-display',
				label: 'Ver Mesas',
				link: '/pages/tables',
				parentId: 'tables',
			},
			{
				id: 'Table-add',
				label: 'Agregar Mesa',
				link: '/pages/tables/crear',
				parentId: 'table',
			},
		],
	},
	{
		id: 'Product',
		label: 'Gestion de Productos',
		icon: 'mdi mdi-truck-fast',
		subItems: [
			{
				id: 'Product-display',
				label: 'Ver Productos',
				link: '/pages/products',
				parentId: 'products',
			},
			{
				id: 'Product-add',
				label: 'Agregar Producto',
				link: '/pages/products/crear',
				parentId: 'product',
			},
		],
	},
	{
		id: 'Ingredient',
		label: 'Gestion de ingredientes',
		icon: 'mdi mdi-file-table-box-multiple',
		subItems: [
			{
				id: 'Orden-display',
				label: 'Ver Ingredientes',
				link: '/pages/ingredient',
				parentId: 'Ingredient',
			},
			{
				id: 'Orden-add',
				label: 'Agregar Ingrediente',
				link: '/pages/ingredient/crear',
				parentId: 'Ingredient',
			},
		],
	}
	,
	{
		id: 'Inventary',
		label: 'Inventario',
		icon: 'mdi mdi-file-edit-outline',
		subItems: [
			{
				id: 'inventary-inventary',
				label: 'Inventario',
				link: '/pages/inventary',
				parentId: 'Inventary',
			},
			{
				id: 'inventary-movements',
				label: 'Movimientos',
				link: '/pages/inventary/movements',
				parentId: 'Inventary',
			},
			{
				id: 'inventary-history',
				label: 'Historial de inventario',
				link: '/pages/inventary/history',
				parentId: 'Inventary',
			},
			{
				id: 'inventary-ingredients',
				label: 'Ingredientes',
				link: '/pages/inventary/ingredients',
				parentId: 'Inventary',
			},
		],
	},
];
