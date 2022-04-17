import './app.scss';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useQuery } from './hooks/query.hook';
import { useGetTriggerOperatorsApi } from '@/hooks/apis/universal.hook';
import { CookieHelpers } from './helpers/cookie.helper';
import { COOKIE_KEY } from './constants/cookie-key';
import Header from './components/header/header';
import Footer from './components/footer/footer';

const isDev = import.meta.env.VITE_ENV === 'dev';

const App = () => {
    const query = useQuery();
    const dashboardTokenFromQueryString =
        query.get(COOKIE_KEY.DASHBOARD_TOKEN) || '';

    if (isDev && dashboardTokenFromQueryString) {
        CookieHelpers.SetCookie({
            name: COOKIE_KEY.DASHBOARD_TOKEN,
            value: dashboardTokenFromQueryString,
        });
    }

    const token = CookieHelpers.GetCookie({ name: COOKIE_KEY.DASHBOARD_TOKEN });
    if (!token) {
        location.href = import.meta.env.VITE_WEBSITE_URL;
    }

    const { getTriggerOperatorsApi } = useGetTriggerOperatorsApi();
    useEffect(() => {
        getTriggerOperatorsApi();
    }, []);

    return token ? (
        <div className="dashboard" data-testid="Dashboard">
            <div className="d-flex">
                <Header />
                <div className="content position-relative container-fluid overflow-scroll px-0 bg-grey-150">
                    <Outlet />
                    <Footer />
                </div>
            </div>
        </div>
    ) : (
        <>Redirect</>
    );
};

export default App;
