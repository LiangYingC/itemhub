import styles from './dashboard.module.scss';
import { Link, Outlet } from 'react-router-dom';
import Header from '@/components/header/header';
import Footer from '@/components/footer/footer';

const Dashboard = () => {
    return (
        <div className={`${styles.dashboard}`} data-testid="Dashboard">
            <div>
                <Header />
                <div className={styles.content + ' position-relative'}>
                    <Outlet />
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
