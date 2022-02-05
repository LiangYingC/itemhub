import { useCallback, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/redux.hook';
import {
    selectDevices,
    devicesActions,
} from '@/redux/reducers/devices.reducer';
import { DevicesDataservice } from '@/dataservices/devices.dataservice';
import { DeviceList } from '@/types/devices.type';

export const useDeviceList = ({
    page,
    limit,
}: {
    page: number;
    limit: number;
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<DeviceList | null>(null);

    const dispatch = useAppDispatch();
    const devices = useAppSelector(selectDevices);

    const fetchDeviceList = useCallback(async () => {
        setIsLoading(true);
        const data = await DevicesDataservice.GetList({ page, limit });
        const deviceList = data.devices;

        setData(deviceList);
        dispatch(devicesActions.addDevices(deviceList));
        setIsLoading(false);
    }, [dispatch, limit, page]);

    useEffect(() => {
        if (devices === null) {
            fetchDeviceList();
        }
    }, [devices, fetchDeviceList]);

    return {
        isLoading,
        deviceList: data,
        fetchDeviceList,
    };
};
