import { useEffect, useState } from 'react';

import decode from 'jwt-decode';
import { useSubscription } from 'react-stomp-hooks';
import {
	addTimeDifference,
	fetchNotifications,
	notificationsStateInitial,
} from '@/utils/notification';
import { useRouter } from 'next/router';

export const useNotification = () => {
	const [notificationState, setNotificationState] = useState(
		notificationsStateInitial
	);
	const router = useRouter();

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
					id: idNotification,
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

	const markAsReadRequest = async (notification) => {
		const errorMessage = {
			message: 'Error marking notification as read',
			redirect: false,
		};
		try {
			const notificationId = +notification.id;
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/usernotifications/`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						notification: {
							id: notificationId,
						},
						user: {
							id: notificationState.userId,
						},
					}),
				}
			);
			if (response.ok) {
				return {
					message: 'Notification marked as read',
					redirect: true,
				};
			}
			return errorMessage;
		} catch (error) {
			return errorMessage;
		}
	};

	const redirectTo = (url = '/', message = '') => {
		const messageQuery = message ? `?mensaje=${message}` : '';
		router.push(`${url}${messageQuery}`);
	};

	const markAsRead = async (notification) => {
		// if the notification is already read, then we don't need to do anything just redirect
		if (!notification || notification.status) {
			redirectTo(notification.redirect || '/pages/orden');
			return;
		}
		const notificationResponse = await markAsReadRequest(notification);
		if (notificationResponse.redirect) {
			setNotificationState((prevState) => ({
				...prevState,
				data: prevState.data.map((n) => {
					if (n.id === notification.id) return { ...n, status: 1 };
					return n;
				}),
				unseenNotifications: Math.max(prevState.unseenNotifications - 1, 0),
			}));
		}
		redirectTo(notification.redirect || '/pages/orden');
	};

	return {
		toggleNotificationDropdown,
		toggleTab,
		markAsRead,
		...notificationState,
	};
};

export default useNotification;
