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

const ValidationRole = Yup.object({
	name: Yup.string().required('Por favor ingrese el nombre'),
	description: Yup.string().required('Por favor ingrese la descripcion'),
});

const ValidationOrder = Yup.object({
	table: Yup.number().required('Por favor ingrese el numero de mesa'),
	description: Yup.string(),
	category: Yup.string().required('Por favor ingrese una categoria'),
});

export { ValidationUser, ValidationRole, ValidationOrder };
