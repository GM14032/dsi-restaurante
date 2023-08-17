import React from 'react';
import NotificationDropdown from './NotificationDropdown';
import { NotificationProvider } from './context';
import dynamic from 'next/dynamic';

const Notifications = () => {
	return (
		<NotificationProvider>
			<NotificationDropdown />
		</NotificationProvider>
	);
};

export default dynamic(() => Promise.resolve(Notifications), {
	ssr: false,
});
