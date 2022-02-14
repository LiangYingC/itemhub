import 'bootstrap/scss/bootstrap.scss';
import './app.scss';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { AuthDataservices } from './dataservices/auth.dataservice';
import { CookieHelpers } from './helpers/cookie.helper';

const isProd = import.meta.env.VITE_ENV === 'prod';

const App = () => {
    // TODO: dashboard dev site 暫時實作簡易的登入系統，之後 website 兩階段驗證完畢後可完全拔掉
    const token = CookieHelpers.GetToken();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const SignWithEmail = async () => {
        if (token === null && email && password && !isProd) {
            const data = await AuthDataservices.SignWithEmail({
                email,
                password,
            });
            const tokenValue = data.token;
            CookieHelpers.SetCookie({
                name: 'token',
                value: tokenValue,
                days: 14,
            });
            window.location.reload();
        }
    };

    return token || isProd ? (
        <Outlet />
    ) : (
        <>
            <label>
                <div>emial:</div>
                <input
                    type="email"
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </label>
            <label>
                <div>password:</div>
                <input
                    type="password"
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                />
            </label>
            <button onClick={SignWithEmail}>登入</button>
        </>
    );
};

export default App;
