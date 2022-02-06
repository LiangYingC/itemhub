import { API_PATH_PREFIX, END_POINT } from '@/constants';
import { ApiHelper } from '@/helpers/api.helper';
import { DeviceList, DeviceItem } from '@/types/devices.type';

export const DevicesDataservice = {
    GetList: async ({ page, limit }: { page: number; limit: number }) => {
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
    GetItem: async ({ id }: { id: number }) => {
        let apiPath = `${API_PATH_PREFIX}${END_POINT.DEVICE}`;
        apiPath = apiPath.replace(':id', id.toString());

        const response: any = await ApiHelper.SendRequestWithToken({
            apiPath,
            method: 'GET',
        });
        return response.data as DeviceItem;
    },
};
