import 'bootstrap/scss/bootstrap.scss';
import './app.scss';
import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthDataservice } from './dataservices/auth.dataservice';
import { CookieHelper } from './helpers/cookie.helper';
// login.local.ts 不會進 Git，現階段請跟 coworker 拿
import { DEV_LOGIN } from '@/login.local';

const App = () => {
    // dev 環境暫時直接打測試帳號的 API 取得 token，便於開發，之後可拔掉
    useEffect(() => {
        const token = CookieHelper.GetCookie('token');

        if (token === null && import.meta.env.VITE_ENV === 'dev') {
            (async () => {
                const data = await AuthDataservice.SignWithEmail({
                    email: DEV_LOGIN.EMAIL,
                    password: DEV_LOGIN.PASSWORD,
                });
                const tokenValue = data.token;
                CookieHelper.SetCookie('token', tokenValue, 7);
            })();
        }
    }, []);
    return <Outlet />;
};

export default App;
