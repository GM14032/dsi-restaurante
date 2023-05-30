import React, { useState,useLayoutEffect } from 'react';
import MenuTitle from '@/Components/ItemLayout/MenuTitle';
import SubItems from '@/Components/ItemLayout/SubItems';
import Item from '@/Components/ItemLayout/Item';
import { getMenu } from '@/utils/menu';

const VerticalLayout = () => {
	const [menu, setMenu] = useState(getMenu);
	useLayoutEffect(() => {
		if (!!menu.length) setMenu(getMenu);
	}, []);
	return (
		<>
			{menu.map((item, key) => {
				return (
					<React.Fragment key={key}>
						{item['isHeader'] ? (
							<MenuTitle label={item.label} />
						) : item.subItems ? (
							<SubItems item={item} />
						) : (
							<Item item={item} />
						)}
					</React.Fragment>
				);
			})}
		</>
	);
};

export default VerticalLayout;