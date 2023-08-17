import { getById } from '@/api';
import { es } from 'date-fns/locale';
import { formatDistanceToNow } from 'date-fns';

export const notificationsStateInitial = {
	data: [],
	total: 0,
	isNotificationDropdown: false,
	activeTab: '1',
	role: null,
	userId: null,
	unseenNotifications: 0,
};

export const calculateTimeDifference = (time) => {
	if (time) {
		return formatDistanceToNow(time, {
			locale: es,
			addSuffix: true,
			includeSeconds: true,
		});
	}
	return null;
};

export const addTimeDifference = (notification) => ({
	...notification,
	timeDifference: calculateTimeDifference(new Date(notification.create_at)),
});

export const fetchNotifications = async (userId) => {
	if (userId !== null) {
		const response = await getById(userId, 'notifications');
		const data = await response.json();
		return data.map(addTimeDifference);
	}
	return [];
};
