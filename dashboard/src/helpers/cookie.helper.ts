import { CookieHelpersInterface } from '@/types/helpers.type';

export const CookieHelpers: CookieHelpersInterface = {
    SetCookie: ({ name, value, days }) => {
        let expires = '';
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            expires = `; expires=${date.toUTCString()}`;
        }
        document.cookie = name + '=' + value + expires + '; path=/';
    },
    GetCookie: ({ name }) => {
        const nameEq = `${name}=`;
        const cookies = document.cookie.split(';');

        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i];
            if (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1, cookie.length);
            }

            if (cookie.indexOf(nameEq) === 0) {
                return cookie.substring(nameEq.length, cookie.length);
            }
        }
        return null;
    },
    EraseCookie: ({ name }) => {
        CookieHelpers.SetCookie({ name, value: '', days: -1 });
    },
};
