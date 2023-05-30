import React, { useState } from 'react';
import { Button, Collapse } from 'reactstrap';
import Link from 'next/link';
import ChildItem from './ChildItem';

const SubItems = ({ item }) => {
	const [isOpen, setIsOpen] = useState(false);
	const toggle = () => setIsOpen(!isOpen);
	return (
		<li className='nav-item'>
			<button
				className='subitems-nav-menu nav-link menu-link'
				href={item.link ? item.link : '/#'}
				data-bs-toggle='collapse'
				onClick={toggle}
			>
				<i className={item.icon}></i>
				<span data-key='t-apps'>{item.label}</span>
				{item.badgeName ? (
					<span
						className={'badge badge-pill bg-' + item.badgeColor}
						data-key='t-new'
					>
						{item.badgeName}
					</span>
				) : null}
			</button>
			<Collapse className='menu-dropdown' isOpen={isOpen} id='sidebarApps'>
				<ul className='nav nav-sm flex-column test'>
					{item.subItems &&
						(item.subItems || []).map((subItem, key) => (
							<React.Fragment key={key}>
								{!subItem.isChildItem ? (

									<li className='nav-item'>
										<Link
											href={subItem.link ? subItem.link : '/'}
											className='nav-link'
										>
											{subItem.label}
											{subItem.badgeName ? (
												<span
													className={
														'badge badge-pill bg-' + subItem.badgeColor
													}
													data-key='t-new'
												>
													{subItem.badgeName}
												</span>
											) : null}
										</Link>
									</li>
								) : (
									<ChildItem subItem={subItem} />
								)}
							</React.Fragment>
						))}
				</ul>
			</Collapse>
		</li>
	);
};

export default SubItems;
