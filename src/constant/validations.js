import * as Yup from 'yup';

const ValidationUser = Yup.object({
	name: Yup.string().required('Por favor ingrese el nombre'),
	lastname: Yup.string().required('Por favor ingrese el apellido'),
	email: Yup.string()
		.email('Por favor ingrese un correo electrónico válido')
		.required('Por favor ingrese el email'),
	phone: Yup.string().required('Por favor ingrese el telefono'),
	username: Yup.string().required('Por favor ingrese el usuario'),
	password: Yup.string().test(
		'required',
		'Por favor ingrese una contraseña',
		function (value) {
			if (this.parent.isUpdate) {
				return true;
			}
			return !!value;
		}
	),
	rol: Yup.string()
		.required('Por favor seleccione un rol')
		.min(1, 'Por favor seleccione un rol'),
});
const ValidationTable = Yup.object({
	capacity: Yup.number().required('Por favor ingrese la capacidad'),
	description: Yup.string().required('Por favor ingrese la descripcion'),
});

const ValidationIngredient = Yup.object({
	name: Yup.string().required('Por favor ingrese el nombre'),
	description: Yup.string().required('Por favor ingrese la descripcion'),
	unit: Yup.string().required('Por favor ingrese la unidad'),	
	minStock: Yup.number().required('Por favor ingrese cantidad'),

});
const ValidationRole = Yup.object({
	name: Yup.string().required('Por favor ingrese el nombre'),
	description: Yup.string().required('Por favor ingrese la descripcion'),
});

const ValidationOrder = Yup.object({
	table: Yup.string()
		.required('Por favor ingrese el numero de mesa')
		.min(1, 'Por favor seleccione una mesa'),
	description: Yup.string(),
});

const ValidationProducto = Yup.object({
	name: Yup.string().required('Por favor ingrese el nombre'),
	price: Yup.number().required('Por favor ingrese el precio'),
	ingredient: Yup.string()
		.required('Por favor ingrese un ingrediente')
		.min(1, 'Por favor seleccione un ingrediente'),
});

const ValidationOrderUpdate = Yup.object({
	table: Yup.number().required('Por favor ingrese el numero de mesa'),
	description: Yup.string(),
	category: Yup.string().required('Por favor ingrese una categoria'),
});

export {
	ValidationUser,
	ValidationRole,
	ValidationOrder,
	ValidationOrderUpdate,
	ValidationTable,
	ValidationIngredient,
	ValidationProducto,
};
