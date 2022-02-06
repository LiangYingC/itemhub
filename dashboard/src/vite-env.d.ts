/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_API_PATH_URL: string;
    readonly VITE_ENV: string;
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
