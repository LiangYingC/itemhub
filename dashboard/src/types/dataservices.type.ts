import { DeviceItem } from './devices.type';

export interface GetDevicesParams {
    page: number;
    limit: number;
}

export interface GetDevicesResponseData {
    devices: DeviceItem[];
    rowNums: number;
}

export interface GetDeviceParams {
    id: number;
}

export interface UpdateDeviceParams {
    id: number;
    editedData: Partial<DeviceItem>;
}

export interface UpdateDeviceResponseData {
    status: string;
}

export interface GetDevicePinsParams {
    id: number;
}

export interface SignWithEmailParams {
    email: string;
    password: string;
}
