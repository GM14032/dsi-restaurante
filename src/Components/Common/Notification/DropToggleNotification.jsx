import React, { useContext } from 'react';
import { NotificationContext } from './context';
import { DropdownToggle } from 'reactstrap';

const DropToggleNotification = () => {
	const { unseenNotifications } = useContext(NotificationContext);
	return (
		<DropdownToggle
			type='button'
			tag='button'
			className='btn btn-icon btn-topbar btn-ghost-secondary rounded-circle'
		>
			<i className='bx bx-bell fs-22'></i>
			{unseenNotifications > 0 && (
				<span className='position-absolute topbar-badge fs-10 translate-middle badge rounded-pill bg-danger'>
					{unseenNotifications}
					<span className='visually-hidden'>unread messages</span>
				</span>
			)}
		</DropdownToggle>
	);
};

export default DropToggleNotification;
