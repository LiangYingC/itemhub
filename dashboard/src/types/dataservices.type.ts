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

export interface DevicesDataservicesInterface {
    GetList: ({
        page,
        limit,
    }: GetDevicesParams) => Promise<GetDevicesResponseData>;
    GetOne: ({ id }: GetSingleDeviceParams) => Promise<DeviceItem>;
    UpdateOne: ({
        id,
        editedData,
    }: UpdateSingleDeviceParams) => Promise<UpdateSingleDeviceResponseData>;
    GetOnePins: ({ id }: GetDevicePinsParams) => Promise<PinItem[]>;
}

export interface AuthDataservicesInterface {
    SignWithEmail: ({
        email,
        password,
    }: {
        email: string;
        password: string;
    }) => Promise<{
        token: string;
    }>;
    IsSigned: () => Promise<{
        state: boolean;
    }>;
}
