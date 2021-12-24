export const ApiHelper = {
    SendRequestWithToken: (
        api: string,
        data: any,
        method: string,
        callbackFunc?: () => {}
    ) => {
        const token = data.token;
        delete data.token;

        return ApiHelper.SendRequest(
            api,
            {
                method: method,
                headers: {
                    Authorization: 'Bearer ' + token,
                },
                body: JSON.stringify(data),
            },
            callbackFunc
        );
    },
    LocalError: (reason: string): any => {
        return {
            status: 'FAILED',
            data: {
                message: reason,
            },
        };
    },
    SendRequest: (
        api: string,
        fetchOption: any,
        callbackFunc?: (result: any) => {}
    ) => {
        return new Promise(async (resolve) => {
            let result;
            const newOption = {
                ...fetchOption,
            };
            delete newOption.headers;

            let resp: any;
            try {
                resp = await ApiHelper.fetch(api, fetchOption);
            } catch (error) {
                result = {
                    status: 'FAILED',
                    data: {
                        message: error,
                    },
                };
                resolve(result);
                return;
            }
            const isDownloadFile = [
                'text/csv',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ].includes(resp.headers.get('content-type'));

            if (resp.status === 200 && !isDownloadFile) {
                const jsonData = await resp.json();
                result = {
                    status: 'OK',
                    httpStatus: resp.status,
                    data: jsonData,
                };
                if (fetchOption.method === 'GET') {
                    const newOption = {
                        ...fetchOption,
                    };
                    delete newOption.headers;
                }
            } else if (resp.status === 200 && isDownloadFile) {
                const blob = await resp.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                let filename = null;
                const disposition = resp.headers.get('content-disposition');
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
                    status: 'OK',
                    httpStatus: 200,
                };
            } else if (resp.status === 204) {
                result = {
                    status: 'FAILED',
                    httpStatus: resp.status,
                    data: {
                        message: '沒有資料',
                    },
                };
            } else {
                const jsonData = await resp.json();
                result = {
                    status: 'FAILED',
                    httpStatus: resp.status,
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
    fetch: (url: string, option: any) => {
        if (option.cache) {
            console.warn('Cound not declate cache in option params');
        }

        if (option.method === 'GET') {
            delete option.body;
        }

        const headers = {
            'Content-Type': 'application/json',
            ...option.headers,
        };

        if (
            option &&
            option.headers &&
            option.headers['Content-Type'] === null
        ) {
            delete headers['Content-Type'];
        }
        if (option.body && !(option.body instanceof FormData)) {
            const newBody = JSON.parse(option.body);
            for (const key in newBody) {
                if (newBody[key] === true) {
                    newBody[key] = 1;
                } else if (newBody[key] === false) {
                    newBody[key] = 0;
                }
            }
            option.body = JSON.stringify(newBody);
        }
        const newOption = {
            ...option,
            headers,
        };
        return fetch(url, newOption);
    },
};
