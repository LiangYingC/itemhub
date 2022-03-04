import { useCallback } from 'react';
import { useAppDispatch } from '@/hooks/redux.hook';
import { useFetchApi } from '@/hooks/apis/fetch.hook';
import { devicesActions } from '@/redux/reducers/devices.reducer';
import { DeviceItem, PinItem } from '@/types/devices.type';
import { ApiHelpers } from '@/helpers/api.helper';
import {
    API_URL,
    END_POINT,
    HTTP_METHOD,
    RESPONSE_STATUS,
} from '@/constants/api';
import { ResponseOK } from '@/types/response.type';

interface GetDevicesResponseData {
    devices: DeviceItem[];
    rowNum: number;
}

export const useGetDevicesApi = ({
    page,
    limit,
}: {
    page: number;
    limit: number;
}) => {
    const fetchGetDevices = useCallback(async () => {
        const apiPath = `${API_URL}${END_POINT.DEVICES}?page=${page}&limit=${limit}`;
        const result =
            await ApiHelpers.SendRequestWithToken<GetDevicesResponseData>({
                apiPath,
                method: HTTP_METHOD.GET,
            });
        return result.data;
    }, [limit, page]);

    const dispatch = useAppDispatch();
    const dispatchRefreshDevices = useCallback(
        (data: GetDevicesResponseData) => {
            if (data) {
                dispatch(devicesActions.refreshDevices(data.devices));
            }
        },
        [dispatch]
    );

    const { isLoading, error, fetchApi } = useFetchApi<GetDevicesResponseData>({
        initialData: null,
        fetchMethod: fetchGetDevices,
        callbackFunc: dispatchRefreshDevices,
    });

    return {
        isLoading,
        error,
        getDevicesApi: fetchApi,
    };
};

export const useGetDeviceApi = ({ id }: { id: number }) => {
    const fetchGetDevice = useCallback(async () => {
        let apiPath = `${API_URL}${END_POINT.DEVICE}`;
        apiPath = apiPath.replace(':id', id.toString());

        const result = await ApiHelpers.SendRequestWithToken<DeviceItem>({
            apiPath,
            method: HTTP_METHOD.GET,
        });
        return result.data;
    }, [id]);

    const dispatch = useAppDispatch();
    const dispatchRefreshDevice = useCallback(
        (data: DeviceItem) => {
            dispatch(devicesActions.refreshDevice(data));
        },
        [dispatch]
    );

    const { isLoading, error, fetchApi } = useFetchApi<DeviceItem>({
        initialData: null,
        fetchMethod: fetchGetDevice,
        callbackFunc: dispatchRefreshDevice,
    });

    return {
        isLoading,
        error,
        getDeviceApi: fetchApi,
    };
};

export const useUpdateDeviceApi = ({
    id,
    editedData,
}: {
    id: number;
    editedData: Partial<DeviceItem>;
}) => {
    const fetchUpdateDevice = useCallback(async () => {
        let apiPath = `${API_URL}${END_POINT.DEVICE}`;
        apiPath = apiPath.replace(':id', id.toString());

        const result = await ApiHelpers.SendRequestWithToken<ResponseOK>({
            apiPath,
            method: HTTP_METHOD.PATCH,
            payload: editedData,
        });
        return result.data;
    }, [editedData, id]);

    const dispatch = useAppDispatch();
    const dispatchRefreshDevices = useCallback(
        (data: ResponseOK) => {
            if (data.status === RESPONSE_STATUS.OK) {
                dispatch(devicesActions.updateDevice({ ...editedData, id }));
            }
        },
        [editedData, id, dispatch]
    );

    const { isLoading, error, fetchApi } = useFetchApi<ResponseOK>({
        initialData: null,
        fetchMethod: fetchUpdateDevice,
        callbackFunc: dispatchRefreshDevices,
    });

    return {
        isLoading,
        error,
        updateDeviceApi: fetchApi,
    };
};

export const useGetDevicePinsApi = ({ id }: { id: number }) => {
    const fetchGetDevice = useCallback(async () => {
        let apiPath = `${API_URL}${END_POINT.DEVICE_PINS}`;
        apiPath = apiPath.replace(':id', id.toString());

        const result = await ApiHelpers.SendRequestWithToken<PinItem[]>({
            apiPath,
            method: HTTP_METHOD.GET,
        });
        return result.data;
    }, [id]);

    const { isLoading, error, data, fetchApi } = useFetchApi<PinItem[]>({
        initialData: null,
        fetchMethod: fetchGetDevice,
    });

    return {
        isLoading,
        error,
        devicePins: data,
        getDevicePinsApi: fetchApi,
    };
};
