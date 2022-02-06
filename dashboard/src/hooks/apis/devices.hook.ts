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
        setIsLoading(true);

        try {
            const data = await DevicesDataservice.GetList({ page, limit });
            const devices = data.devices;
            dispatch(devicesActions.refreshDevices(devices));
        } catch (err: any) {
            setError(err.toString());
        }

        setIsLoading(false);
    }, [dispatch, limit, page]);

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
        setIsLoading(true);

        try {
            const data = await DevicesDataservice.GetItem({ id });
            dispatch(devicesActions.refreshSingleDevice(data));
        } catch (err: any) {
            setError(err.toString());
        }

        setIsLoading(false);
    }, [id, dispatch]);

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
        setIsLoading(true);

        try {
            const data = await DevicesDataservice.PatchItem({ id, editedData });
            if (data.status === 'OK') {
                console.log('in');
                dispatch(
                    devicesActions.updateSingleDevice({ ...editedData, id })
                );
            }
        } catch (err: any) {
            setError(err.toString());
        }

        setIsLoading(false);
    }, [id, editedData, dispatch]);

    return {
        isLoading,
        error,
        updateSingleDevice,
    };
};
