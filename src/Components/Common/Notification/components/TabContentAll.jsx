import React, { useContext } from 'react';
import { TabPane } from 'reactstrap';
import SimpleBar from 'simplebar-react';
import { NotificationContext } from '../context';
import ItemNotification from './ItemNotification';

const TabContentAll = () => {
	const { data, markAsRead } = useContext(NotificationContext);
	return (
		<TabPane tabId='1' className='py-2 ps-2'>
			<SimpleBar style={{ maxHeight: '300px' }} className='pe-2'>
				{data?.map((notification) => (
					<ItemNotification
						key={notification.id}
						notification={notification}
						markAsRead={markAsRead}
					/>
				))}
				<div className='my-3 text-center'>
					<button
						type='button'
						className='btn btn-soft-success waves-effect waves-light'
					>
						View All Notifications
						<i className='ri-arrow-right-line align-middle'></i>
					</button>
				</div>
			</SimpleBar>
		</TabPane>
	);
};

export default TabContentAll;
