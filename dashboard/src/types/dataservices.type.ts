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

export interface DevicesDataserviceInterface {
    getList: ({
        page,
        limit,
    }: GetDevicesParams) => Promise<GetDevicesResponseData>;
    getOne: ({ id }: GetSingleDeviceParams) => Promise<DeviceItem>;
    updateOne: ({
        id,
        editedData,
    }: UpdateSingleDeviceParams) => Promise<UpdateSingleDeviceResponseData>;
    getOnePins: ({ id }: GetDevicePinsParams) => Promise<PinItem[]>;
}

export interface AuthDataserviceInterface {
    signWithEmail: ({
        email,
        password,
    }: {
        email: string;
        password: string;
    }) => Promise<{
        token: string;
    }>;
    isSigned: () => Promise<{
        state: boolean;
    }>;
}
