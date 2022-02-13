export const CookieHelper = {
    SetCookie: (name: string, value: string, days: number) => {
        let expires = '';
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            expires = '; expires=' + date.toUTCString();
        }
        document.cookie = name + '=' + value + expires + '; path=/';
    },
    GetCookie: (name: string): string | null => {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0)
                return c.substring(nameEQ.length, c.length);
        }
        return null;
    },
    EraseCookie: (name: string) => {
        CookieHelper.SetCookie(name, '', -1);
    },
    GetToken: () => {
        const token = CookieHelper.GetCookie('token');
        if (token) {
            return token;
        }

        /** TODO:
         * 未來會轉導到 /auth/sign-in/，並有機會藉由 history state 的紀錄，去判斷登入後，要轉導回哪一頁。
         * 如有更多 token 相關處理邏輯，可以封裝於此 function 中。
         */
        window.history.pushState({}, '', '/');
    },
};
