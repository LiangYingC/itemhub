import { API_URL, END_POINT, FETCH_METHOD } from '@/constants/api';
import { ApiHelpers } from '@/helpers/api.helper';
import { DeviceItem, PinItem } from '@/types/devices.type';
import {
    GetDevicesResponseData,
    UpdateSingleDeviceResponseData,
} from '@/types/dataservices.type';
import { DevicesDataservicesInterface } from '@/types/dataservices.type';

export const DevicesDataservices: DevicesDataservicesInterface = {
    getList: async ({ page, limit }) => {
        const apiPath = `${API_URL}${END_POINT.DEVICES}?page=${page}&limit=${limit}`;

        const result =
            await ApiHelpers.sendRequestWithToken<GetDevicesResponseData>({
                apiPath,
                method: FETCH_METHOD.GET,
            });
        return result.data;
    },
    getOne: async ({ id }) => {
        let apiPath = `${API_URL}${END_POINT.DEVICE}`;
        apiPath = apiPath.replace(':id', id.toString());

        const result = await ApiHelpers.sendRequestWithToken<DeviceItem>({
            apiPath,
            method: FETCH_METHOD.GET,
        });
        return result.data;
    },
    updateOne: async ({ id, editedData }) => {
        let apiPath = `${API_URL}${END_POINT.DEVICE}`;
        apiPath = apiPath.replace(':id', id.toString());

        const result =
            await ApiHelpers.sendRequestWithToken<UpdateSingleDeviceResponseData>(
                {
                    apiPath,
                    method: FETCH_METHOD.PATCH,
                    payload: editedData,
                }
            );
        return result.data;
    },
    getOnePins: async ({ id }) => {
        let apiPath = `${API_URL}${END_POINT.DEVICE_PINS}`;
        apiPath = apiPath.replace(':id', id.toString());

        const result = await ApiHelpers.sendRequestWithToken<PinItem[]>({
            apiPath,
            method: FETCH_METHOD.GET,
        });
        return result.data;
    },
};
