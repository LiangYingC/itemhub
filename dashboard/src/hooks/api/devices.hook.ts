import { useCallback, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/redux.hook';
import {
    selectDevices,
    devicesActions,
} from '@/redux/reducers/devices.reducer';
import { DevicesDataservice } from '@/dataservices/devices.dataservice';

export const useGetDeviceList = ({
    page,
    limit,
}: {
    page: number;
    limit: number;
}) => {
    const dispatch = useAppDispatch();
    const devices = useAppSelector(selectDevices);

    const [data, setData] = useState(devices);
    const [isLoading, setIsLoading] = useState(false);

    const getDeviceList = useCallback(async () => {
        setIsLoading(true);
        const data = await DevicesDataservice.GetList({ page, limit });
        const deviceList = data.devices;

        setData(deviceList);
        dispatch(devicesActions.addDevices(deviceList));
        setIsLoading(false);
    }, [dispatch, limit, page]);

    useEffect(() => {
        if (data === null && !isLoading) {
            getDeviceList();
        }
    }, [data, getDeviceList, isLoading]);

    return {
        isLoading,
        deviceList: data,
        getDeviceList,
    };
};

export const useGetDeviceItem = ({ id }: { id: number }) => {
    const devices = useAppSelector(selectDevices);
    const deviceItem = devices?.filter((device) => device.id === id)[0] || null;

    const [data, setData] = useState(deviceItem);
    const [isLoading, setIsLoading] = useState(false);

    const getDeviceItem = useCallback(async () => {
        setIsLoading(true);
        const data = await DevicesDataservice.GetItem({ id });
        setData(data);
        setIsLoading(false);
    }, [id]);

    useEffect(() => {
        if (data === null && !isLoading) {
            getDeviceItem();
        }
    }, [data, getDeviceItem, isLoading]);

    return {
        isLoading,
        deviceItem: data,
        getDeviceItem,
    };
};
