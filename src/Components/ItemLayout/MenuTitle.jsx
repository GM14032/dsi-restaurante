import React from 'react';

const MenuTitle = ({ label = '' }) => {
	return (
		<li className='menu-title'>
			<span data-key='t-menu'>{label} </span>
		</li>
	);
};

export default MenuTitle;
