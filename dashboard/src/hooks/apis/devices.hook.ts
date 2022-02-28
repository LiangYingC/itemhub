import { useCallback } from 'react';
import { useAppDispatch } from '@/hooks/redux.hook';
import { useFetchApi } from '@/hooks/apis/fetch.hook';
import { devicesActions } from '@/redux/reducers/devices.reducer';
import { DevicesDataservices } from '@/dataservices/devices.dataservice';
import { DeviceItem, PinItem } from '@/types/devices.type';
import {
    GetDevicesParams,
    GetDevicesResponseData,
    GetDeviceParams,
    UpdateDeviceParams,
    UpdateDeviceResponseData,
    GetDevicePinsParams,
} from '@/types/dataservices.type';
import { RESPONSE_STATUS } from '@/constants/api';

export const useGetDevicesApi = ({ page, limit }: GetDevicesParams) => {
    const fetchGetDevices = useCallback(() => {
        return DevicesDataservices.GetList({ page, limit });
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

export const useGetDeviceApi = ({ id }: GetDeviceParams) => {
    const fetchGetDevice = useCallback(() => {
        return DevicesDataservices.GetOne({ id });
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

export const useUpdateDeviceApi = ({ id, editedData }: UpdateDeviceParams) => {
    const fetchUpdateDevice = useCallback(
        () =>
            DevicesDataservices.UpdateOne({
                id,
                editedData,
            }),
        [editedData, id]
    );

    const dispatch = useAppDispatch();
    const dispatchRefreshDevices = useCallback(
        (data: UpdateDeviceResponseData) => {
            if (data.status === RESPONSE_STATUS.OK) {
                dispatch(devicesActions.updateDevice({ ...editedData, id }));
            }
        },
        [editedData, id, dispatch]
    );

    const { isLoading, error, fetchApi } =
        useFetchApi<UpdateDeviceResponseData>({
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

export const useGetDevicePinsApi = ({ id }: GetDevicePinsParams) => {
    const fetchGetDevice = useCallback(
        () => DevicesDataservices.GetOnePins({ id }),
        [id]
    );

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
