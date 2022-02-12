import { API_URL, END_POINT, FETCH_METHOD } from '@/constants/api';
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
        const apiPath = `${API_URL}${END_POINT.DEVICES}?page=${page}&limit=${limit}`;

        const response: any = await ApiHelper.SendRequestWithToken({
            apiPath,
            method: FETCH_METHOD.GET,
        });

        return response.data as GetDevicesResponseData;
    },
    GetOne: async ({ id }: GetSingleDeviceParams) => {
        let apiPath = `${API_URL}${END_POINT.DEVICE}`;
        apiPath = apiPath.replace(':id', id.toString());

        const response: any = await ApiHelper.SendRequestWithToken({
            apiPath,
            method: FETCH_METHOD.GET,
        });
        return response.data as DeviceItem;
    },
    UpdateOne: async ({ id, editedData }: UpdateSingleDeviceParams) => {
        let apiPath = `${API_URL}${END_POINT.DEVICE}`;
        apiPath = apiPath.replace(':id', id.toString());

        const response: any = await ApiHelper.SendRequestWithToken({
            apiPath,
            method: FETCH_METHOD.PATCH,
            payload: editedData,
        });
        return response.data as UpdateSingleDeviceResponseData;
    },
    GetOnePins: async ({ id }: GetDevicePinsParams) => {
        let apiPath = `${API_URL}${END_POINT.DEVICE_PINS}`;
        apiPath = apiPath.replace(':id', id.toString());

        const response: any = await ApiHelper.SendRequestWithToken({
            apiPath,
            method: FETCH_METHOD.GET,
        });
        return response.data as PinItem[];
    },
};
