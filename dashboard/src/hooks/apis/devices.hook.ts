import { useCallback } from 'react';
import { useAppDispatch } from '@/hooks/redux.hook';
import { useFetchApi } from '@/hooks/apis/fetch.hook';
import { devicesActions } from '@/redux/reducers/devices.reducer';
import { ApiHelpers } from '@/helpers/api.helper';
import { DeviceItem, PinItem } from '@/types/devices.type';
import {
    API_URL,
    END_POINT,
    HTTP_METHOD,
    RESPONSE_STATUS,
} from '@/constants/api';
import { ResponseOK } from '@/types/response.type';
import { pinsActions } from '@/redux/reducers/pins.reducer';

interface GetDevicesResponseData {
    devices: DeviceItem[];
    rowNum: number;
}

export const useGetDevicesApi = ({
    page,
    limit,
    name,
}: {
    page: number;
    limit: number;
    name: string;
}) => {
    const dispatch = useAppDispatch();
    const dispatchRefreshDevices = useCallback(
        (data: GetDevicesResponseData) => {
            if (data) {
                dispatch(devicesActions.refresh(data));
            }
        },
        [dispatch]
    );
    const apiPath = ApiHelpers.AppendQueryStrings({
        basicPath: `${API_URL}${END_POINT.DEVICES}`,
        queryStrings: {
            page,
            limit,
            name,
        },
    });

    const { isLoading, error, fetchApi } = useFetchApi<GetDevicesResponseData>({
        apiPath,
        method: HTTP_METHOD.GET,
        initialData: null,
        callbackFunc: dispatchRefreshDevices,
    });

    return {
        isGetingDevices: isLoading,
        getDevicesError: error,
        getDevicesApi: fetchApi,
    };
};

export const useGetAllDevicesApi = () => {
    const apiPath = `${API_URL}${END_POINT.All_DEVICES}`;

    const { isLoading, data, error, fetchApi } = useFetchApi<DeviceItem[]>({
        apiPath,
        method: HTTP_METHOD.GET,
        initialData: null,
    });

    return {
        isGetingAllDevices: isLoading,
        getAllDevicesError: error,
        allDevices: data || [],
        getAllDevicesApi: fetchApi,
    };
};

export const useGetDeviceApi = ({ id }: { id: number }) => {
    const dispatch = useAppDispatch();
    const dispatchAppendDevice = useCallback(
        (data: DeviceItem) => {
            dispatch(devicesActions.append(data));
        },
        [dispatch]
    );

    let apiPath = `${API_URL}${END_POINT.DEVICE}`;
    apiPath = apiPath.replace(':id', id.toString());

    const { isLoading, error, fetchApi } = useFetchApi<DeviceItem>({
        apiPath,
        method: HTTP_METHOD.GET,
        initialData: null,
        callbackFunc: dispatchAppendDevice,
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
    const dispatchUpdate = useCallback(
        (data: ResponseOK) => {
            if (data.status === RESPONSE_STATUS.OK) {
                dispatch(devicesActions.update({ ...editedData, id }));
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
        callbackFunc: dispatchUpdate,
    });

    return {
        isLoading,
        error,
        updateDeviceApi: fetchApi,
    };
};

export const useDeleteDevicesApi = (ids: number[]) => {
    const dispatch = useAppDispatch();
    const dispatchDeleteDeivce = useCallback(
        (data: ResponseOK) => {
            if (data.status === RESPONSE_STATUS.OK) {
                dispatch(devicesActions.deleteMultiple({ ids }));
            }
        },
        [ids, dispatch]
    );

    const apiPath = `${API_URL}${END_POINT.DEVICES}`;

    const { isLoading, error, fetchApi, data } = useFetchApi<ResponseOK>({
        apiPath,
        method: HTTP_METHOD.DELETE,
        payload: ids,
        initialData: null,
        callbackFunc: dispatchDeleteDeivce,
    });

    return {
        isLoading,
        error,
        fetchApi,
        data,
    };
};

export const useGetDevicePinsApi = ({ id }: { id: number }) => {
    const dispatch = useAppDispatch();
    const dispatchRefreshPins = useCallback(
        (data: PinItem[]) => {
            dispatch(pinsActions.refreshPins(data));
        },
        [id, dispatch]
    );
    let apiPath = `${API_URL}${END_POINT.DEVICE_PINS}`;
    apiPath = apiPath.replace(':id', id.toString());

    const { isLoading, error, data, fetchApi } = useFetchApi<PinItem[]>({
        apiPath,
        method: HTTP_METHOD.GET,
        initialData: null,
        callbackFunc: dispatchRefreshPins,
    });

    return {
        isLoading,
        error,
        devicePins: data,
        getDevicePinsApi: fetchApi,
    };
};

export const useUpdateDevicePinNameApi = ({
    deviceId,
    pin,
    name,
    callbackFunc,
}: {
    deviceId: number;
    pin: string;
    name: string | null;
    callbackFunc: () => void;
}) => {
    const dispatch = useAppDispatch();
    const dispatchUpdatePin = useCallback(
        (data: ResponseOK) => {
            if (data.status === RESPONSE_STATUS.OK) {
                if (callbackFunc) callbackFunc();
                dispatch(pinsActions.updatePin({ name, deviceId, pin }));
            }
        },
        [name, deviceId, pin, dispatch, callbackFunc]
    );

    let apiPath = `${API_URL}${END_POINT.DEVICE_PIN}`;
    apiPath = apiPath.replace(':id', deviceId.toString()).replace(':pin', pin);

    const { isLoading, error, fetchApi } = useFetchApi<ResponseOK>({
        apiPath,
        method: HTTP_METHOD.PATCH,
        payload: {
            name: name,
        },
        initialData: null,
        callbackFunc: dispatchUpdatePin,
    });

    return {
        isLoading,
        error,
        updateDevicePinNameApi: fetchApi,
    };
};

export const useUpdateDeviceSwitchPinApi = ({
    deviceId,
    pin,
    value,
}: {
    deviceId: number;
    pin: string;
    value: number;
}) => {
    const dispatch = useAppDispatch();
    const dispatchUpdatePin = useCallback(
        (data: ResponseOK) => {
            if (data.status === RESPONSE_STATUS.OK) {
                dispatch(pinsActions.updatePin({ value, deviceId, pin }));
            }
        },
        [value, deviceId, pin, dispatch]
    );

    let apiPath = `${API_URL}${END_POINT.DEVICE_SWITCH_PIN}`;
    apiPath = apiPath.replace(':id', deviceId.toString()).replace(':pin', pin);

    const { isLoading, error, fetchApi } = useFetchApi<ResponseOK>({
        apiPath,
        method: HTTP_METHOD.PATCH,
        payload: {
            value,
        },
        initialData: null,
        callbackFunc: dispatchUpdatePin,
    });

    return {
        isLoading,
        error,
        updateDeviceSwitchPinApi: fetchApi,
    };
};
