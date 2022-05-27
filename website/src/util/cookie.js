export const CookieUtil = {
    setCookie: (name, value, days, unixTimestamp) => {
        let expires = '';
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toGMTString();
        }
        if (unixTimestamp) {
            expires = `; expires=${(new Date(unixTimestamp * 1000)).toUTCString()}`;
        }
        document.cookie = name + '=' + value + expires + '; path=/';
    },
    getCookie: (name) => {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },
    eraseCookie: (name) => {
        CookieUtil.setCookie(name, '', -1);
    }
};
