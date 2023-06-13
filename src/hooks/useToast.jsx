import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { ToastContainer, toast } from 'react-toastify';

const useToast = () => {
	const router = useRouter();
	const [customToast, setCustomToast] = useState();

	useEffect(() => {
		setCustomToast(
			router.query.mensaje && (
				<>
					{toast(router.query.mensaje, {
						position: 'top-right',
						hideProgressBar: false,
						className: 'bg-success text-white',
						progress: undefined,
						toastId: '',
					})}
					<ToastContainer autoClose={2000} limit={1} />
				</>
			)
		);
	}, [router.query.mensaje]);

	return { customToast };
};

export default useToast;
