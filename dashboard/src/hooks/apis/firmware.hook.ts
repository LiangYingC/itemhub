import { useFetchApi } from '@/hooks/apis/fetch.hook';

import { API_URL, END_POINT, HTTP_METHOD } from '@/constants/api';
import { ResponseOK } from '@/types/response.type';

export const useDownloadFirmwareApi = ({ bundleId }: { bundleId: string }) => {
    let apiPath = `${API_URL}${END_POINT.FIRMWARE}`;
    apiPath = apiPath.replace(':bundleId', bundleId.toString());

    const { isLoading, error, data, fetchApi, httpStatus } =
        useFetchApi<ResponseOK>({
            apiPath,
            method: HTTP_METHOD.GET,
            initialData: null,
        });

    return {
        isLoading,
        error,
        fetchApi,
        data,
        httpStatus,
    };
};
