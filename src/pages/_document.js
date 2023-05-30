import React from 'react';
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html
			lang='en'
			data-layout-style='default'
			data-layout-mode='light'
			data-layout-position='fixed'
			data-topbar='light'
			data-layout='vertical'
			data-sidebar-visibility='show'
			data-sidebar-size='lg'
			data-layout-width='fluid'
			data-sidebar='dark'
			data-sidebar-image='none'
		>
			<Head />
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
