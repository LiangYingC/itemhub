import { DeviceItem } from '@/types/devices.type';

export interface TriggerItem {
    id: number;
    ownerId: number;
    createdAt: string;
    editedAt: string | null;
    deletedAt: string | null;
    operator: number;
    sourceDevice: DeviceItem | null;
    sourceDeviceId: number;
    sourcePin: string;
    sourceThreshold: number;
    destinationDevice: DeviceItem | null;
    destinationDeviceId: number;
    destinationDeviceSourceState: number;
    destinationDeviceTargetState: number;
    destinationPin: string;
}
