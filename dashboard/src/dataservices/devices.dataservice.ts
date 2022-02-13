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
} from '@/types/devices.dataservice.type';

export const DevicesDataservice = {
    GetList: async ({ page, limit }: GetDevicesParams) => {
        const apiPath = `${API_URL}${END_POINT.DEVICES}?page=${page}&limit=${limit}`;

        const result =
            await ApiHelper.sendRequestWithToken<GetDevicesResponseData>({
                apiPath,
                method: FETCH_METHOD.GET,
            });
        return result.data;
    },
    GetOne: async ({ id }: GetSingleDeviceParams) => {
        let apiPath = `${API_URL}${END_POINT.DEVICE}`;
        apiPath = apiPath.replace(':id', id.toString());

        const result = await ApiHelper.sendRequestWithToken<DeviceItem>({
            apiPath,
            method: FETCH_METHOD.GET,
        });
        return result.data;
    },
    UpdateOne: async ({ id, editedData }: UpdateSingleDeviceParams) => {
        let apiPath = `${API_URL}${END_POINT.DEVICE}`;
        apiPath = apiPath.replace(':id', id.toString());

        const result =
            await ApiHelper.sendRequestWithToken<UpdateSingleDeviceResponseData>(
                {
                    apiPath,
                    method: FETCH_METHOD.PATCH,
                    payload: editedData,
                }
            );
        return result.data;
    },
    GetOnePins: async ({ id }: GetDevicePinsParams) => {
        let apiPath = `${API_URL}${END_POINT.DEVICE_PINS}`;
        apiPath = apiPath.replace(':id', id.toString());

        const result = await ApiHelper.sendRequestWithToken<PinItem[]>({
            apiPath,
            method: FETCH_METHOD.GET,
        });
        return result.data;
    },
};
