import React, { useContext } from 'react';
import { NotificationContext } from '../context';
import { Col, Nav, NavItem, NavLink, Row } from 'reactstrap';
import classnames from 'classnames';

const NotificationHeader = () => {
	const { unseenNotifications, toggleTab, activeTab, total } =
		useContext(NotificationContext);
	return (
		<div className='dropdown-head bg-primary bg-pattern rounded-top'>
			<div className='p-3'>
				<Row className='align-items-center'>
					<Col>
						<h6 className='m-0 fs-16 fw-semibold text-white'>Notifications</h6>
					</Col>
					<div className='col-auto dropdown-tabs'>
						{unseenNotifications > 0 && (
							<span className='badge badge-soft-light fs-13'>
								{unseenNotifications} New
							</span>
						)}
					</div>
				</Row>
			</div>
			<div className='px-2 pt-2'>
				<Nav className='nav-tabs dropdown-tabs nav-tabs-custom'>
					<NavItem>
						<NavLink
							href='#'
							className={classnames({ active: activeTab === '1' })}
							onClick={() => {
								toggleTab('1');
							}}
						>
							All ({total})
						</NavLink>
					</NavItem>
				</Nav>
			</div>
		</div>
	);
};

export default NotificationHeader;
