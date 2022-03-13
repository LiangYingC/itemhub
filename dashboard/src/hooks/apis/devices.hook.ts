import { useCallback } from 'react';
import { useAppDispatch } from '@/hooks/redux.hook';
import { useFetchApi } from '@/hooks/apis/fetch.hook';
import { devicesActions } from '@/redux/reducers/devices.reducer';
import { DeviceItem, PinItem } from '@/types/devices.type';
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
    const dispatch = useAppDispatch();
    const dispatchRefreshDevices = useCallback(
        (data: GetDevicesResponseData) => {
            if (data) {
                dispatch(devicesActions.refreshDevices(data.devices));
            }
        },
        [dispatch]
    );
    const apiPath = `${API_URL}${END_POINT.DEVICES}?page=${page}&limit=${limit}`;

    const { isLoading, error, fetchApi } = useFetchApi<GetDevicesResponseData>({
        apiPath,
        method: HTTP_METHOD.GET,
        initialData: null,
        callbackFunc: dispatchRefreshDevices,
    });

    return {
        isLoading,
        error,
        getDevicesApi: fetchApi,
    };
};

export const useGetDeviceApi = ({ id }: { id: number }) => {
    const dispatch = useAppDispatch();
    const dispatchRefreshDevice = useCallback(
        (data: DeviceItem) => {
            dispatch(devicesActions.refreshDevice(data));
        },
        [dispatch]
    );

    let apiPath = `${API_URL}${END_POINT.DEVICE}`;
    apiPath = apiPath.replace(':id', id.toString());

    const { isLoading, error, fetchApi } = useFetchApi<DeviceItem>({
        apiPath,
        method: HTTP_METHOD.GET,
        initialData: null,
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
    const dispatch = useAppDispatch();
    const dispatchRefreshDevices = useCallback(
        (data: ResponseOK) => {
            if (data.status === RESPONSE_STATUS.OK) {
                dispatch(devicesActions.updateDevice({ ...editedData, id }));
            }
        },
        [editedData, id, dispatch]
    );

    let apiPath = `${API_URL}${END_POINT.DEVICE}`;
    apiPath = apiPath.replace(':id', id.toString());

    const { isLoading, error, fetchApi } = useFetchApi<ResponseOK>({
        apiPath,
        method: HTTP_METHOD.PATCH,
        payload: editedData,
        initialData: null,
        callbackFunc: dispatchRefreshDevices,
    });

    return {
        isLoading,
        error,
        updateDeviceApi: fetchApi,
    };
};

export const useGetDevicePinsApi = ({ id }: { id: number }) => {
    let apiPath = `${API_URL}${END_POINT.DEVICE_PINS}`;
    apiPath = apiPath.replace(':id', id.toString());

    const { isLoading, error, data, fetchApi } = useFetchApi<PinItem[]>({
        apiPath,
        method: HTTP_METHOD.GET,
        initialData: null,
    });

    return {
        isLoading,
        error,
        devicePins: data,
        getDevicePinsApi: fetchApi,
    };
};
