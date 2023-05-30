import Link from 'next/link';
import React, { useState } from 'react';
import { Collapse } from 'reactstrap';

const ChildItem = ({ subItem }) => {
	const [isOpen, setIsOpen] = useState(false);
	const toggle = () => setIsOpen(!isOpen);

	return (
		<>
			<li className='nav-item'>
				<button
					className='subitems-nav-menu nav-link'
					data-bs-toggle='collapse'
					onClick={toggle}
				>
					{subItem.label}
					{subItem.badgeName ? (
						<span
							className={'badge badge-pill bg-' + subItem.badgeColor}
							data-key='t-new'
						>
							{subItem.badgeName}
						</span>
					) : null}
				</button>
				<Collapse
					className='menu-dropdown'
					isOpen={isOpen}
					id='sidebarEcommerce'
				>
					<ul className='nav nav-sm flex-column'>
						{subItem.childItems &&
							(subItem.childItems || []).map((childItem, key) => (
								<li className='nav-item' key={key} >
									<Link
										href={childItem.link ? childItem.link : '/#'}
										className='nav-link'
									>

										{childItem.label}
									</Link>
								</li>
							))}
					</ul>
				</Collapse>
			</li>
		</>
	);
};

export default ChildItem;
