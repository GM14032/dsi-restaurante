import React, { Fragment } from 'react';
import SimpleBar from 'simplebar-react';
import logoSm from '../assets/images/logo-sm.png';
import logoDark from '../assets/images/logo-dark.png';
import logoLight from '../../public/logo-light.png';
import VerticalLayout from './VerticalLayout';
import { Container } from 'reactstrap';
import Image from 'next/image';

const Sidebar = ({ className = '', toggleSidebar = () => {} }) => {
	return (
		<Fragment>
			<div className={`app-menu navbar-menu ${className}`}>
				<div className='navbar-brand-box'>
					<button className='logo logo-dark btn_clean ' onClick={toggleSidebar}>
						<span className='logo-sm'>
							<Image src={logoSm} alt='' height='22' />
						</span>
						<span className='logo-lg'>
							<Image src={logoDark} alt='' height='17' />
						</span>
					</button>

					<button className='logo logo-light btn_clean' onClick={toggleSidebar}>
						<span className='logo-sm'>
							<Image src={logoSm} alt='' height='22' />
						</span>
						<span className='logo-lg'>
							<Image src={logoLight} alt='' height='17' />
						</span>
					</button>
					<button
						type='button'
						className='btn btn-sm p-0 fs-20 header-item float-end btn-vertical-sm-hover'
						id='vertical-hover'
					>
						<i className='ri-record-circle-line'></i>
					</button>
				</div>

				<Fragment>
					<SimpleBar id='scrollbar' className='h-100'>
						<Container fluid>
							<div id='two-column-menu'></div>
							<ul className='navbar-nav' id='navbar-nav'>
								<VerticalLayout />
							</ul>
						</Container>
					</SimpleBar>
					<div className='sidebar-background'></div>
				</Fragment>
			</div>
			<div className='vertical-sidebar-enable'></div>
		</Fragment>
	);
};

export default Sidebar;
