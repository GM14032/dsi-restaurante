import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useRouter } from 'next/router';
import decode from 'jwt-decode';
import { PERMISSIONS, NO_PERMISSIONS } from '../constant/permissions';
const Layout = ({ children, title = 'Dashboard', content = '' }) => {
	const [isOpenSidebar, setIsOpenSidebar] = useState({
		isOpenSidebar: true,
		className: {
			sidebar: 'vertical-collpsed',
			content: 'content-margin',
		},
	});
	const toggleSidebar = () => {
		setIsOpenSidebar(() => ({
			...isOpenSidebar,
			isOpenSidebar: !isOpenSidebar.isOpenSidebar,
			className: !isOpenSidebar.isOpenSidebar
				? {
						sidebar: 'vertical-collpsed',
						content: 'content-margin',
				  }
				: {
						sidebar: 'vertical-hidden',
						content: '',
				  },
		}));
	};
	const router = useRouter();
	useEffect(() => {
		const needPermission = NO_PERMISSIONS.includes(router.pathname);
		if (needPermission) {
			return;
		}
		const token = localStorage.getItem('token');
		if (!token) {
			router.push('/auth/login');
			return;
		}
		const decoded = decode(token);
		//console.log(decoded.permission)
		//console.log(PERMISSIONS)
		const hasPermission = decoded.permission.some(
			(permission) =>
				PERMISSIONS[permission] &&
				PERMISSIONS[permission].includes(router.pathname)
		);
		//console.log({ hasPermission });
		if (!hasPermission) {
			console.log({ hasPermission });
			router.push('/');
			return;
		}
	}, []);
	return (
		<>
			<Head>
				<title>{title}</title>
				<meta name='description' content={content} />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<div id='layout-wrapper'>
				<Header
					toggleSidebar={toggleSidebar}
					headerClass={`topbar-shadow ${isOpenSidebar.className.content}`}
				/>

				<Sidebar
					toggleSidebar={toggleSidebar}
					className={isOpenSidebar.className.sidebar}
				/>
				<div className={`main-content ${isOpenSidebar.className.content}`}>
					<div className='page-content' style={{ marginBottom: '20px' }}>
						{children}
					</div>
					<Footer className={isOpenSidebar.className.content} />
				</div>
			</div>
		</>
	);
};

export default Layout;
