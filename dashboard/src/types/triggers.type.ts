import { DeviceItem } from '@/types/devices.type';

export interface TriggerItem {
    id: number;
    ownerId: number;
    createdAt: string;
    editedAt: null | string;
    deletedAt: string | null;
    operator: number;
    sourceDevice: DeviceItem;
    sourceDeviceId: number;
    sourcePin: string;
    sourceThreshold: number;
    destinationDevice: DeviceItem;
    destinationDeviceId: number;
    destinationDeviceSourceState: number;
    destinationDeviceTargetState: number;
    destinationPin: string;
}
