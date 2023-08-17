import React, { useContext } from 'react';
import { NotificationContext } from './context';
import { DropdownMenu, TabContent } from 'reactstrap';

import NotificationHeader from './components/NotificationHeader';
import TabContentAll from './components/TabContentAll';

const DropMenu = () => {
	const { activeTab } = useContext(NotificationContext);
	return (
		<DropdownMenu className='dropdown-menu-lg dropdown-menu-end p-0'>
			<NotificationHeader />

			<TabContent activeTab={activeTab}>
				<TabContentAll />
			</TabContent>
		</DropdownMenu>
	);
};

export default DropMenu;
