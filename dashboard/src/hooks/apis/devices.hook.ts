import { useCallback, useState } from 'react';
import { useAppDispatch } from '@/hooks/redux.hook';
import { devicesActions } from '@/redux/reducers/devices.reducer';
import { DevicesDataservice } from '@/dataservices/devices.dataservice';
import { DeviceItem } from '@/types/devices.type';

export const useRefreshDevices = ({
    page,
    limit,
}: {
    page: number;
    limit: number;
}) => {
    const dispatch = useAppDispatch();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const refreshDevices = useCallback(async () => {
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
        refreshDevices,
    };
};

export const useRefreshDeviceItem = ({ id }: { id: number }) => {
    const dispatch = useAppDispatch();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const refreshSingleDevice = useCallback(async () => {
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
        refreshSingleDevice,
    };
};

export const useUpdateSingleDevice = ({
    id,
    editedData,
}: {
    id: number;
    editedData: Partial<DeviceItem>;
}) => {
    const dispatch = useAppDispatch();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const updateSingleDevice = useCallback(async () => {
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
        updateSingleDevice,
    };
};
