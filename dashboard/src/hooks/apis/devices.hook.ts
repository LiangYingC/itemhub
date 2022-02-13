import { useCallback } from 'react';
import { useAppDispatch } from '@/hooks/redux.hook';
import { useFetchApi } from '@/hooks/apis/fetch.hook';
import { devicesActions } from '@/redux/reducers/devices.reducer';
import { DevicesDataservices } from '@/dataservices/devices.dataservice';
import { DeviceItem, PinItem } from '@/types/devices.type';
import {
    GetDevicesParams,
    GetDevicesResponseData,
    GetSingleDeviceParams,
    UpdateSingleDeviceParams,
    UpdateSingleDeviceResponseData,
    GetDevicePinsParams,
} from '@/types/dataservices.type';
import { RESPONSE_STATUS } from '@/constants/api';

export const useGetDevicesApi = ({ page, limit }: GetDevicesParams) => {
    const fetchGetDevices = useCallback(() => {
        return DevicesDataservices.getList({ page, limit });
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

export const useGetSingleDeviceApi = ({ id }: GetSingleDeviceParams) => {
    const fetchGetSingleDevice = useCallback(() => {
        return DevicesDataservices.getOne({ id });
    }, [id]);

    const dispatch = useAppDispatch();
    const dispatchRefreshDevices = useCallback(
        (data: DeviceItem) => {
            dispatch(devicesActions.refreshSingleDevice(data));
        },
        [dispatch]
    );

    const { isLoading, error, fetchApi } = useFetchApi<DeviceItem>({
        initialData: null,
        fetchMethod: fetchGetSingleDevice,
        callbackFunc: dispatchRefreshDevices,
    });

    return {
        isLoading,
        error,
        getSingleDeviceApi: fetchApi,
    };
};

export const useUpdateSingleDeviceApi = ({
    id,
    editedData,
}: UpdateSingleDeviceParams) => {
    const fetchUpdateSingleDevice = useCallback(
        () =>
            DevicesDataservices.updateOne({
                id,
                editedData,
            }),
        [editedData, id]
    );

    const dispatch = useAppDispatch();
    const dispatchRefreshDevices = useCallback(
        (data: UpdateSingleDeviceResponseData) => {
            if (data.status === RESPONSE_STATUS.OK) {
                dispatch(
                    devicesActions.updateSingleDevice({ ...editedData, id })
                );
            }
        },
        [editedData, id, dispatch]
    );

    const { isLoading, error, fetchApi } =
        useFetchApi<UpdateSingleDeviceResponseData>({
            initialData: null,
            fetchMethod: fetchUpdateSingleDevice,
            callbackFunc: dispatchRefreshDevices,
        });

    return {
        isLoading,
        error,
        updateSingleDeviceApi: fetchApi,
    };
};

export const useGetDevicePinsApi = ({ id }: GetDevicePinsParams) => {
    const fetchGetSingleDevice = useCallback(
        () => DevicesDataservices.getOnePins({ id }),
        [id]
    );

    const { isLoading, error, data, fetchApi } = useFetchApi<PinItem[]>({
        initialData: null,
        fetchMethod: fetchGetSingleDevice,
    });

    return {
        isLoading,
        error,
        devicePins: data,
        getDevicePinsApi: fetchApi,
    };
};
