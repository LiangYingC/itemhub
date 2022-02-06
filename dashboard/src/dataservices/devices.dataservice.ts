import { API_PATH_PREFIX, END_POINT } from '@/constants/api';
import { ApiHelper } from '@/helpers/api.helper';
import { DeviceList, DeviceItem } from '@/types/devices.type';

export const DevicesDataservice = {
    GetDevices: async ({ page, limit }: { page: number; limit: number }) => {
        const apiPath = `${API_PATH_PREFIX}${END_POINT.DEVICES}?page=${page}&limit=${limit}`;

        const response: any = await ApiHelper.SendRequestWithToken({
            apiPath,
            method: 'GET',
        });

        return response.data as {
            devices: DeviceList;
            rowNums: number;
        };
    },
    GetSingleItem: async ({ id }: { id: number }) => {
        let apiPath = `${API_PATH_PREFIX}${END_POINT.DEVICE}`;
        apiPath = apiPath.replace(':id', id.toString());

        const response: any = await ApiHelper.SendRequestWithToken({
            apiPath,
            method: 'GET',
        });
        return response.data as DeviceItem;
    },
    UpdateSingleDevice: async ({
        id,
        editedData,
    }: {
        id: number;
        editedData: Partial<DeviceItem>;
    }) => {
        let apiPath = `${API_PATH_PREFIX}${END_POINT.DEVICE}`;
        apiPath = apiPath.replace(':id', id.toString());

        const response: any = await ApiHelper.SendRequestWithToken({
            apiPath,
            method: 'PATCH',
            payload: editedData,
        });
        return response.data as { status: string };
    },
    GetDevicePins: async ({ id }: { id: number }) => {
        let apiPath = `${API_PATH_PREFIX}${END_POINT.DEVICE_PINS}`;
        apiPath = apiPath.replace(':id', id.toString());

        const response: any = await ApiHelper.SendRequestWithToken({
            apiPath,
            method: 'GET',
        });
        return response.data as { status: string };
    },
};
