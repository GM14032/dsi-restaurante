import React from 'react';
import Link from 'next/link';

const ItemNotification = ({ notification, markAsRead }) => {
	return (
		<div
			className={`text-reset notification-item d-block dropdown-item position-relative ${
				!notification.status && 'unseenNotification'
			}`}
			onClick={() => markAsRead(notification)}
		>
			<div className='d-flex'>
				<div className='avatar-xs me-3'>
					<span className='avatar-title bg-soft-info text-info rounded-circle fs-16'>
						<i className='bx bx-badge-check'></i>
					</span>
				</div>
				<div className='flex-1'>
					<Link href='#' className='stretched-link'>
						<h6 className='mt-0 mb-2 lh-base'>{notification.message}</h6>
					</Link>
					<p className='mb-0 fs-11 fw-medium text-uppercase text-muted'>
						<span>
							<i className='mdi mdi-clock-outline'></i>{' '}
							{`Recibido ${notification.timeDifference}`}
						</span>
					</p>
				</div>
			</div>
		</div>
	);
};

export default ItemNotification;
