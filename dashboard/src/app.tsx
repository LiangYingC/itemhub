import 'bootstrap/scss/bootstrap.scss';
import './app.scss';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { AuthDataservices } from './dataservices/auth.dataservice';
import { CookieHelpers } from './helpers/cookie.helper';

const isProd = import.meta.env.VITE_ENV === 'prod';
import { useQuery } from './hooks/query.hook';

const App = () => {
    const query = useQuery();
    const dashboardTokenFromQueryString = query.get('dashboardToken') || '';
    if (!isProd && dashboardTokenFromQueryString) {
        CookieHelpers.SetCookie({
            name: 'dashboardToken',
            value: dashboardTokenFromQueryString,
        });
    }
    const token = CookieHelpers.GetCookie({ name: 'dashboardToken' });
    return token ? <Outlet /> : <>Redirect</>;
};

export default App;
