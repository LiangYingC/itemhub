import { API_PATH_PREFIX, END_POINT } from '@/constants/api';
import { ApiHelper } from '@/helpers/api.helper';
import { DeviceItem, PinItem } from '@/types/devices.type';
import {
    GetDevicesParams,
    GetDevicesResponseData,
    GetSingleDeviceParams,
    UpdateSingleDeviceParams,
    UpdateSingleDeviceResponseData,
    GetDevicePinsParams,
} from '@/types/devices.dataservice';

export const DevicesDataservice = {
    GetList: async ({ page, limit }: GetDevicesParams) => {
        const apiPath = `${API_PATH_PREFIX}${END_POINT.DEVICES}?page=${page}&limit=${limit}`;

        const response: any = await ApiHelper.SendRequestWithToken({
            apiPath,
            method: 'GET',
        });

        return response.data as GetDevicesResponseData;
    },
    GetSingle: async ({ id }: GetSingleDeviceParams) => {
        let apiPath = `${API_PATH_PREFIX}${END_POINT.DEVICE}`;
        apiPath = apiPath.replace(':id', id.toString());

        const response: any = await ApiHelper.SendRequestWithToken({
            apiPath,
            method: 'GET',
        });
        return response.data as DeviceItem;
    },
    UpdateSingle: async ({ id, editedData }: UpdateSingleDeviceParams) => {
        let apiPath = `${API_PATH_PREFIX}${END_POINT.DEVICE}`;
        apiPath = apiPath.replace(':id', id.toString());

        const response: any = await ApiHelper.SendRequestWithToken({
            apiPath,
            method: 'PATCH',
            payload: editedData,
        });
        return response.data as UpdateSingleDeviceResponseData;
    },
    GetSinglePins: async ({ id }: GetDevicePinsParams) => {
        let apiPath = `${API_PATH_PREFIX}${END_POINT.DEVICE_PINS}`;
        apiPath = apiPath.replace(':id', id.toString());

        const response: any = await ApiHelper.SendRequestWithToken({
            apiPath,
            method: 'GET',
        });
        return response.data as PinItem[];
    },
};
