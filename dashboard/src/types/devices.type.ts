export interface DeviceItem {
    id: number;
    name: string;
    ownerId: number;
    deviceId: string;
    createdAt: string;
    editedAt: null | string;
    deletedAt: null | string;
    info: null | string;
    online: boolean;
    zone: null | string;
    zoneId: null | number;
}

export interface PinItem {
    pin: string;
    deviceId: number;
    value: number;
    mode: number;
    createdAt: string | null;
    name: string | null;
}
