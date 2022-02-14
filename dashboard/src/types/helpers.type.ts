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

export interface FetchResult<T> {
    httpStatus: number;
    status: string;
    data: T;
}

export interface FetchErrorResultData {
    errorKey: string;
    message: string;
    payload: any[];
    stackTrace: string;
}
export interface FetchErrorResult {
    httpStatus: number;
    status: string;
    data: FetchErrorResultData;
}

export interface ApiHelpersInterface {
    SendRequestWithToken: <T>({
        apiPath,
        method,
        headers,
        payload,
        shouldDeleteContentType,
        callbackFunc,
    }: SendRequestParams) => Promise<FetchResult<T>>;
    SendRequest: <T>({
        apiPath,
        method,
        headers,
        payload,
        shouldDeleteContentType,
        callbackFunc,
    }: SendRequestParams) => Promise<FetchResult<T>>;
    Fetch: ({
        apiPath,
        fetchOption,
        shouldDeleteContentType,
    }: FetchParams) => Promise<Response>;
    HandleDownloadFile: ({ response }: { response: Response }) => Promise<{
        httpStatus: number;
        status: string;
        data: {
            message: string;
        };
    }>;
}

export interface CookieHelpersInterface {
    SetCookie: ({
        name,
        value,
        days,
    }: {
        name: string;
        value: string;
        days?: number;
    }) => void;
    GetCookie: ({ name }: { name: string }) => string | null;
    EraseCookie: ({ name }: { name: string }) => void;
}
