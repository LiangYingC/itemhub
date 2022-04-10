import styles from './dashboard.module.scss';
import { Link, Outlet } from 'react-router-dom';
import Header from '@/components/header/header';
import Footer from '@/components/footer/footer';

const Dashboard = () => {
    return (
        <div className={`${styles.dashboard} bg-dark`} data-testid="Dashboard">
            <div>
                <Header />
                <nav className="mx-3">
                    <Link to="/dashboard/devices">Devices</Link> |{' '}
                    <Link to="/dashboard/triggers">Triggers</Link> |{' '}
                    <Link to="/dashboard/oauth-clients">oAuth Clients</Link>
                </nav>
                <Outlet />
                <Footer />
            </div>
        </div>
    );
};

export default Dashboard;
