import { CookieHelper } from '@/helpers/cookie.helper';
import { FETCH_METHOD, RESPONSE_STATUS } from '@/constants/api';
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

export const ApiHelper = {
    SendRequestWithToken: ({
        apiPath,
        method,
        headers = {},
        payload = null,
        shouldDeleteContentType = false,
        callbackFunc,
    }: SendRequestParams) => {
        const token = CookieHelper.GetCookie('token');

        if (token) {
            return ApiHelper.SendRequest({
                apiPath,
                method,
                headers: { Authorization: `Bearer ${token}`, ...headers },
                payload,
                shouldDeleteContentType,
                callbackFunc,
            });
        } else {
            import.meta.env.VITE_ENV === 'prod'
                ? (window.location.href = '/')
                : alert('empty token');
        }
    },
    SendRequest: ({
        apiPath,
        method,
        headers = {},
        payload = null,
        shouldDeleteContentType = false,
        callbackFunc,
    }: SendRequestParams) => {
        const fetchOption = payload
            ? {
                  method: method,
                  headers,
                  body: JSON.stringify(payload),
              }
            : {
                  method: method,
                  headers,
              };

        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            let result: any;
            let response: Response;

            try {
                response = await ApiHelper.Fetch({
                    apiPath,
                    fetchOption,
                    shouldDeleteContentType,
                });
            } catch (error) {
                alert('目前發生問題，請稍後再試');

                result = {
                    status: RESPONSE_STATUS.FAILED,
                    data: {
                        message: error,
                    },
                };
                return reject(result);
            }

            const contentType = response.headers.get('content-type');
            const downloadTypes = [
                'text/csv',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ];
            const isDownloadFile =
                response.status === 200 &&
                contentType &&
                downloadTypes.includes(contentType);

            if (isDownloadFile) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                let filename = null;

                const disposition = response.headers.get('content-disposition');
                if (disposition && disposition.indexOf('attachment') !== -1) {
                    const filenameRegex =
                        /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                    const matches = filenameRegex.exec(disposition);
                    if (matches != null && matches[1]) {
                        filename = matches[1].replace(/['"]/g, '');
                    }
                }

                a.classList.add('skip-swim-router');
                document.body.appendChild(a);
                a.href = url;
                if (filename !== null) {
                    a.download = filename;
                }
                a.click();

                setTimeout(() => {
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                }, 0);

                result = {
                    status: RESPONSE_STATUS.OK,
                    httpStatus: 200,
                };
            }

            if (response.status === 200) {
                const jsonData = await response.json();
                result = {
                    status: RESPONSE_STATUS.OK,
                    httpStatus: response.status,
                    data: jsonData,
                };
            } else if (response.status === 204) {
                result = {
                    status: RESPONSE_STATUS.FAILED,
                    httpStatus: response.status,
                    data: {
                        message: '沒有資料',
                    },
                };
            } else {
                const jsonData = await response.json();
                result = {
                    status: RESPONSE_STATUS.FAILED,
                    httpStatus: response.status,
                    data: {
                        message: jsonData.message,
                        invalidatedPayload: jsonData.invalidatedPayload,
                    },
                };
            }
            if (callbackFunc) {
                callbackFunc(result);
            }
            resolve(result);
        });
    },
    Fetch: ({ apiPath, fetchOption, shouldDeleteContentType }: FetchParams) => {
        if (
            fetchOption.method === FETCH_METHOD.GET &&
            typeof fetchOption.body !== 'undefined'
        ) {
            throw new Error(
                `Don't set body payload when fetch method is ${FETCH_METHOD.GET}.`
            );
        }

        const headers = shouldDeleteContentType
            ? fetchOption.headers
            : {
                  'Content-Type': 'application/json',
                  ...fetchOption.headers,
              };

        if (
            fetchOption.body &&
            !(JSON.parse(fetchOption.body) instanceof FormData)
        ) {
            const newBody = JSON.parse(fetchOption.body);
            for (const key in newBody) {
                if (newBody[key] === true) {
                    newBody[key] = 1;
                } else if (newBody[key] === false) {
                    newBody[key] = 0;
                }
            }
            fetchOption.body = JSON.stringify(newBody);
        }

        const finalOption = {
            ...fetchOption,
            headers,
        };

        return fetch(apiPath, finalOption);
    },
};
