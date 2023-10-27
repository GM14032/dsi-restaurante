import useNotification from '@/hooks/useNotification';
import { notificationsStateInitial } from '@/utils/notification';
import { createContext } from 'react';

export const NotificationContext = createContext({
	...notificationsStateInitial,
	toggleNotificationDropdown: () => {},
	toggleTab: () => {},
	markAsReadWithoutRedirect: () => {},
	markAsRead: () => {},
});

export const NotificationProvider = ({ children }) => {
	const notificationLocalState = useNotification();

	return (
		<NotificationContext.Provider value={{ ...notificationLocalState }}>
			{children}
		</NotificationContext.Provider>
	);
};
