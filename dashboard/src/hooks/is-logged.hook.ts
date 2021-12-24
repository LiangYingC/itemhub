import { useState, useEffect } from 'react';
import { END_POINT } from '../constants';
import { AuthDataservice } from '../dataservices/auth.dataservice';
import { CookieHelper } from '../helpers/cookie.helper';
import { ApiHelper } from '../helpers/api.helper';

export function useIsLogged() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async function () {
            setLoading(true);
            const token = CookieHelper.GetCookie('token');
            if (token) {
                const resp: any = await AuthDataservice.IsSignIn(token);
                if (resp.status === 'OK') {
                    setData(resp);
                } else {
                    setError(resp);
                }
            } else {
                setError(ApiHelper.LocalError('empty token'));
            }
            setLoading(false);
        })();
    }, [true]);

    return { data, error, loading };
}
