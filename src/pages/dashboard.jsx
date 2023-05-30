import dynamic from 'next/dynamic';

const Dashboard = dynamic(() => import('../Components/DashboardEcommerce'), {
	ssr: false,
});

export default Dashboard;
