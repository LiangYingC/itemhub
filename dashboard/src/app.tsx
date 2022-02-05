import 'bootstrap/scss/bootstrap.scss';
import './app.scss';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { AuthDataservice } from './dataservices/auth.dataservice';
import { CookieHelper } from './helpers/cookie.helper';

const isProd = import.meta.env.VITE_ENV === 'prod';

const App = () => {
    // dashboard dev site 暫時實作簡易的登入系統，之後 website 兩階段驗證完畢後可拔掉
    const token = CookieHelper.GetCookie('token');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signWithEmail = async () => {
        if (token === null && email && password && !isProd) {
            const data = await AuthDataservice.SignWithEmail({
                email,
                password,
            });
            const tokenValue = data.token;
            CookieHelper.SetCookie('token', tokenValue, 7);
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
            <button onClick={signWithEmail}>登入</button>
        </>
    );
};

export default App;
