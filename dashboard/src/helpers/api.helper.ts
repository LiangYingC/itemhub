import { CookieHelper } from '@/helpers/cookie.helper';
import { FETCH_METHOD, RESPONSE_STATUS } from '@/constants/api';
import { ApiHelperInterface, FetchResult } from '@/types/helpers.type';

export const ApiHelper: ApiHelperInterface = {
    sendRequestWithToken: ({
        apiPath,
        method,
        headers = {},
        payload = null,
        shouldDeleteContentType = false,
        callbackFunc,
    }) => {
        const token = CookieHelper.getToken();
        return ApiHelper.sendRequest({
            apiPath,
            method,
            headers: { Authorization: `Bearer ${token}`, ...headers },
            payload,
            shouldDeleteContentType,
            callbackFunc,
        });
    },
    sendRequest: ({
        apiPath,
        method,
        headers = {},
        payload = null,
        shouldDeleteContentType = false,
        callbackFunc,
    }) => {
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
        return new Promise<FetchResult>(async (resolve, reject) => {
            let result: FetchResult;
            const response = await ApiHelper.fetch({
                apiPath,
                fetchOption,
                shouldDeleteContentType,
            });

            if (!response.ok) {
                const errorJsonData = await response.json();
                result = {
                    httpStatus: response.status,
                    status: RESPONSE_STATUS.FAILED,
                    data: errorJsonData,
                };
                reject(result);
            }

            if (response.status === 200) {
                const contentType = response.headers.get('content-type');
                const downloadTypes = [
                    'text/csv',
                    'application/vnd.ms-excel',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                ];
                const isDownloadFile =
                    contentType && downloadTypes.includes(contentType);

                if (isDownloadFile) {
                    result = await ApiHelper.handleDownloadFile({ response });
                } else {
                    const jsonData = await response.json();
                    result = {
                        httpStatus: response.status,
                        status: RESPONSE_STATUS.OK,
                        data: jsonData,
                    };
                }
            } else {
                result = {
                    httpStatus: response.status,
                    status: RESPONSE_STATUS.OK,
                    data: {
                        message: response.statusText,
                    },
                };
            }

            if (callbackFunc) {
                callbackFunc(result);
            }

            resolve(result);
        });
    },
    fetch: ({ apiPath, fetchOption, shouldDeleteContentType }) => {
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
    handleDownloadFile: async ({ response }) => {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        let filename = null;

        const disposition = response.headers.get('content-disposition');
        if (disposition && disposition.indexOf('attachment') !== -1) {
            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
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

        return {
            httpStatus: 200,
            status: RESPONSE_STATUS.OK,
            data: {
                message: 'Download file successfully.',
            },
        };
    },
};
