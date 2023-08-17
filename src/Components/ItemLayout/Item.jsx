import Link from 'next/link';
import React from 'react';

const Item = ({ item }) => {
	return (
		<li className='nav-item' style={{ 'paddingLeft': '5px'}}>
			<Link className='nav-link menu-link' href={item.link ? item.link : '/#'}>
				<i className={item.icon}></i> <span>{item.label}</span>
				{item.badgeName ? (
					<span
						className={'badge badge-pill bg-' + item.badgeColor}
						data-key='t-new'
					>
						{item.badgeName}
					</span>
				) : null}
			</Link>
		</li>
	);
};

export default Item;
