import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import {
	Alert} from 'reactstrap';
const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem('token'); // elimina el token de autenticación al cerrar sesión
    router.push('/auth/login'); // redirecciona al usuario a la página de inicio de sesión
  }, []);

  return (
    <div>
      <Alert color="primary">
        Cerrando sesión...
      </Alert>
    </div>
  );
};

export default Logout;