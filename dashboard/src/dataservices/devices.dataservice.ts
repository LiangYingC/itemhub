import { API_URL, END_POINT, HTTP_METHOD } from '@/constants/api';
import { ApiHelpers } from '@/helpers/api.helper';
import { DeviceItem, PinItem } from '@/types/devices.type';
import {
    GetDevicesResponseData,
    UpdateSingleDeviceResponseData,
    GetDevicesParams,
    GetSingleDeviceParams,
    UpdateSingleDeviceParams,
    GetDevicePinsParams
} from '@/types/dataservices.type';


export const DevicesDataservices = {
    GetList: async ({ page, limit }: GetDevicesParams) => {
        const apiPath = `${API_URL}${END_POINT.DEVICES}?page=${page}&limit=${limit}`;

        const result =
            await ApiHelpers.SendRequestWithToken<GetDevicesResponseData>({
                apiPath,
                method: HTTP_METHOD.GET,
            });
        return result.data;
    },
    GetOne: async ({ id }: GetSingleDeviceParams) => {
        let apiPath = `${API_URL}${END_POINT.DEVICE}`;
        apiPath = apiPath.replace(':id', id.toString());

        const result = await ApiHelpers.SendRequestWithToken<DeviceItem>({
            apiPath,
            method: HTTP_METHOD.GET,
        });
        return result.data;
    },
    UpdateOne: async ({ id, editedData }: UpdateSingleDeviceParams) => {
        let apiPath = `${API_URL}${END_POINT.DEVICE}`;
        apiPath = apiPath.replace(':id', id.toString());

        const result =
            await ApiHelpers.SendRequestWithToken<UpdateSingleDeviceResponseData>(
                {
                    apiPath,
                    method: HTTP_METHOD.PATCH,
                    payload: editedData,
                }
            );
        return result.data;
    },
    GetOnePins: async ({ id }: GetDevicePinsParams) => {
        let apiPath = `${API_URL}${END_POINT.DEVICE_PINS}`;
        apiPath = apiPath.replace(':id', id.toString());

        const result = await ApiHelpers.SendRequestWithToken<PinItem[]>({
            apiPath,
            method: HTTP_METHOD.GET,
        });
        return result.data;
    },
};
