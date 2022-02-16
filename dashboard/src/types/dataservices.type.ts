import { DeviceItem, PinItem } from './devices.type';

export interface GetDevicesParams {
    page: number;
    limit: number;
}

export interface GetDevicesResponseData {
    devices: DeviceItem[];
    rowNums: number;
}

export interface GetSingleDeviceParams {
    id: number;
}

export interface UpdateSingleDeviceParams {
    id: number;
    editedData: Partial<DeviceItem>;
}

export interface UpdateSingleDeviceResponseData {
    status: string;
}

export interface GetDevicePinsParams {
    id: number;
}

export interface SignWithEmailParams {
    email: string;
    password: string;
}



