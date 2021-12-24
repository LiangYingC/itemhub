import { Link, Outlet } from 'react-router-dom';
import styles from './Dashboard.module.scss';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { useIsLogged } from '../../hooks/is-logged.hook';
import { DeviceDataservice } from '../../dataservices/device.dataservice';

const Dashboard = () => {
    const { data, loading, error } = useIsLogged();

    return (
        <div className={styles.Dashboard} data-testid="Dashboard">
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
