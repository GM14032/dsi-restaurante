import { useEffect, useState } from 'react';

import decode from 'jwt-decode';
import { useSubscription } from 'react-stomp-hooks';
import {
	addTimeDifference,
	fetchNotifications,
	notificationsStateInitial,
} from '@/utils/notification';

export const useNotification = () => {
	const [notificationState, setNotificationState] = useState(
		notificationsStateInitial
	);

	useEffect(() => {
		const getNotifications = async () => {
			const data = await fetchNotifications(notificationState.userId);
			setNotificationState((prevState) => ({
				...prevState,
				total: data.length,
				data,
				unseenNotifications: data.filter((n) => !n.status).length, // if status == 0 then it's the same that false
			}));
		};
		getNotifications();
	}, [notificationState.userId]);

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token) {
			const decoded = decode(token);
			setNotificationState((prevState) => ({
				...prevState,
				role: decoded.role,
				userId: decoded.id,
			}));
		}
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			setNotificationState((prevState) => ({
				...prevState,
				data: prevState.data.map(addTimeDifference),
			}));
		}, 1000);
		return () => {
			clearInterval(interval);
		};
	}, []);

	useSubscription(`/topic/message/${notificationState.role}`, (msg) => {
		const { message, idNotification } = JSON.parse(msg.body) || {};
		setNotificationState((prevState) => ({
			...prevState,
			unseenNotifications: prevState.unseenNotifications + 1,
			total: prevState.total + 1,
			data: [
				{
					id: `server-${idNotification}`,
					message: message,
					create_at: new Date(),
					idNotification: idNotification,
					status: 0,
				},
				...prevState.data,
			],
		}));
	});

	const toggleNotificationDropdown = () => {
		setNotificationState((prevState) => ({
			...prevState,
			isNotificationDropdown: !prevState.isNotificationDropdown,
		}));
	};

	const toggleTab = (tab) => {
		if (notificationState.activeTab !== tab) {
			setNotificationState((prevState) => ({
				...prevState,
				activeTab: tab,
			}));
		}
	};

	const markAsRead = async (notification) => {
		// if the notification is already read, then we don't need to do anything
		if (!notification || notification.status) return;
		// await markAsReadRequest(idNotification);
		setNotificationState((prevState) => ({
			...prevState,
			data: prevState.data.map((n) => {
				if (n.id === notification.id) return { ...n, status: 1 };
				return n;
			}),
			unseenNotifications: Math.max(prevState.unseenNotifications - 1, 0),
		}));
	};

	return {
		toggleNotificationDropdown,
		toggleTab,
		markAsRead,
		...notificationState,
	};
};

export default useNotification;
