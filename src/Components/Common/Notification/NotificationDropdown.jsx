import React, { useContext } from 'react';
import { Dropdown } from 'reactstrap';
import dynamic from 'next/dynamic';
import DropToggleNotification from './DropToggleNotification';
import { NotificationContext } from './context';
import DropMenu from './DropMenu';

const NotificationDropdown = () => {
	const { isNotificationDropdown, toggleNotificationDropdown } =
		useContext(NotificationContext);

	return (
		<React.Fragment>
			<Dropdown
				isOpen={isNotificationDropdown}
				toggle={toggleNotificationDropdown}
				className='topbar-head-dropdown ms-1 header-item'
			>
				<DropToggleNotification />
				<DropMenu />
			</Dropdown>
		</React.Fragment>
	);
};

export default NotificationDropdown;
