import { useCallback, useState } from 'react';
import { useAppDispatch } from '@/hooks/redux.hook';
import { devicesActions } from '@/redux/reducers/devices.reducer';
import { DevicesDataservice } from '@/dataservices/devices.dataservice';
import { DeviceItem } from '@/types/devices.type';

export const useGetDevicesApi = ({
    page,
    limit,
}: {
    page: number;
    limit: number;
}) => {
    const dispatch = useAppDispatch();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const getDevicesApi = useCallback(async () => {
        if (isLoading) return;

        try {
            setIsLoading(true);
            const data = await DevicesDataservice.GetDevices({ page, limit });
            const devices = data.devices;
            dispatch(devicesActions.refreshDevices(devices));
        } catch (err: any) {
            setError(err.toString());
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, limit, page, dispatch]);

    return {
        isLoading,
        error,
        getDevicesApi,
    };
};

export const useGetSingleDeviceApi = ({ id }: { id: number }) => {
    const dispatch = useAppDispatch();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const getSingleDeviceApi = useCallback(async () => {
        if (isLoading) return;

        try {
            setIsLoading(true);
            const data = await DevicesDataservice.GetSingleItem({ id });
            dispatch(devicesActions.refreshSingleDevice(data));
        } catch (err: any) {
            setError(err.toString());
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, id, dispatch]);

    return {
        isLoading,
        error,
        getSingleDeviceApi,
    };
};

export const useUpdateSingleDeviceApi = ({
    id,
    editedData,
}: {
    id: number;
    editedData: Partial<DeviceItem>;
}) => {
    const dispatch = useAppDispatch();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const updateSingleDeviceApi = useCallback(async () => {
        if (isLoading) return;

        try {
            setIsLoading(true);
            const data = await DevicesDataservice.UpdateSingleDevice({
                id,
                editedData,
            });
            if (data.status === 'OK') {
                console.log('in');
                dispatch(
                    devicesActions.updateSingleDevice({ ...editedData, id })
                );
            }
        } catch (err: any) {
            setError(err.toString());
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, id, editedData, dispatch]);

    return {
        isLoading,
        error,
        updateSingleDeviceApi,
    };
};
