interface SendRequestParams {
    apiPath: string;
    method: string;
    headers?: { [key: string]: any };
    payload?: any;
    shouldDeleteContentType?: boolean;
    callbackFunc?: (result: any) => null;
}

interface FetchParams {
    apiPath: string;
    fetchOption: {
        method: string;
        headers: { [key: string]: any };
        body?: string;
    };
    shouldDeleteContentType: boolean;
}

export interface FetchResult {
    httpStatus: number;
    status: string;
    data: { [key: string]: any };
}

export interface ApiHelperInterface {
    sendRequestWithToken: ({
        apiPath,
        method,
        headers,
        payload,
        shouldDeleteContentType,
        callbackFunc,
    }: SendRequestParams) => Promise<FetchResult>;
    sendRequest: ({
        apiPath,
        method,
        headers,
        payload,
        shouldDeleteContentType,
        callbackFunc,
    }: SendRequestParams) => Promise<FetchResult>;
    fetch: ({
        apiPath,
        fetchOption,
        shouldDeleteContentType,
    }: FetchParams) => Promise<Response>;
    handleDownloadFile: ({ response }: { response: Response }) => Promise<{
        httpStatus: number;
        status: string;
        data: {
            message: string;
        };
    }>;
}

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
