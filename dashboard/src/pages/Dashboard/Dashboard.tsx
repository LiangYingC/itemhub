import { Link, Outlet } from 'react-router-dom';
import styles from './dashboard.module.scss';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import { useIsSigned } from '../../hooks/is-signed.hook';

const Dashboard = () => {
    const { data, loading, error } = useIsSigned();

    return (
        <div className={styles.dashboard} data-testid="Dashboard">
            {loading ? (
                <div>Loading</div>
            ) : error ? (
                <div>{JSON.stringify(error)}</div>
            ) : (
                <div>
                    <Header></Header>
                    <h1>Itemhub</h1>
                    <hr />
                    <nav>
                        <Link to="/devices">Devices</Link> |{' '}
                        <Link to="/triggers">Triggers</Link> |{' '}
                        <Link to="/oauth-clients">oAuth Clients</Link>
                    </nav>
                    <Outlet></Outlet>
                    <Footer></Footer>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
