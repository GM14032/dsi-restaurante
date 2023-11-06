import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import decode from 'jwt-decode';
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from 'reactstrap';
import avatar1 from '../../../public/avatar2.jpg';
import Image from 'next/image';

const ProfileDropdown = () => {
	const [userName, setUserName] = useState();
	const [name, setName] = useState();
	const [lastname, setLastName] = useState();
	const [role, setRole] = useState();

	const [isProfileDropdown, setIsProfileDropdown] = useState(false);
	const toggleProfileDropdown = () => {
		setIsProfileDropdown(!isProfileDropdown);
	};
	
	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token) {
			const decoded = decode(token);
			//console.log(decoded);
			setName(decoded.name)
			setLastName(decoded.lastName)
			setRole(decoded.role)
		}
	  }, []);
	return (
		<React.Fragment>
			<Dropdown
				isOpen={isProfileDropdown}
				toggle={toggleProfileDropdown}
				className='ms-sm-3 header-item topbar-user'
			>
				<DropdownToggle tag='button' type='button' className='btn'>
					<span className='d-flex align-items-center'>
						<Image
							className='rounded-circle header-profile-user'
							src='https://white-tree-0f5d46f10.4.azurestaticapps.net/avatar2.jpg'
							width= '32'
							height= '32'
							alt='Header Avatar'
						/>
						<span className='text-start ms-xl-2'>
							<span className='d-none d-xl-inline-block ms-1 fw-medium user-name-text'>
								{name} {lastname}
							</span>
							<span className='d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text'>
								{role}
							</span>
						</span>
					</span>
				</DropdownToggle>
				<DropdownMenu className='dropdown-menu-end'>
					<h6 className='dropdown-header'>Welcome {name} {lastname}!</h6>
					<DropdownItem className='p-0'>
						<Link
							href={process.env.PUBLIC_URL + '/profile'}
							className='dropdown-item'
						>
							<i className='mdi mdi-account-circle text-muted fs-16 align-middle me-1'></i>
							<span className='align-middle'>Profile</span>
						</Link>
					</DropdownItem>
					<div className='dropdown-divider'></div>
					<DropdownItem className='p-0'>
						<Link
							href={'/auth/logout'}
							className='dropdown-item'
						>
							<i className='mdi mdi-logout text-muted fs-16 align-middle me-1'></i>{' '}
							<span className='align-middle' data-key='t-logout'>
								Logout
							</span>
						</Link>
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		</React.Fragment>
	);
};

export default ProfileDropdown;
