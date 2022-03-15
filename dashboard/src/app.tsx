import 'bootstrap/scss/bootstrap.scss';
import './app.scss';
import { Outlet } from 'react-router-dom';
import { CookieHelpers } from './helpers/cookie.helper';

const isDev = import.meta.env.VITE_ENV === 'dev';
import { useQuery } from './hooks/query.hook';
import { COOKIE_KEY } from './constants/cookie-key';

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
    return token ? <Outlet /> : <>Redirect</>;
};

export default App;
