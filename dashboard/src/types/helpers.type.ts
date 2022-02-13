export interface CookieHelperInterface {
    setCookie: ({
        name,
        value,
        days,
    }: {
        name: string;
        value: string;
        days?: number;
    }) => void;
    getCookie: ({ name }: { name: string }) => string | null;
    eraseCookie: ({ name }: { name: string }) => void;
    getToken: () => string | null;
}
