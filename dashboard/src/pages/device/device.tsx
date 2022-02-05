import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from './device.module.scss';
import { DevicesDataservice } from '@/dataservices/devices.dataservice';
import { DeviceItem } from '@/types/devices.type';

const Device = () => {
    const { id } = useParams();
    const [device, setDevice] = useState<DeviceItem | null>(null);
    useEffect(() => {
        (async () => {
            const data = await DevicesDataservice.GetItem({
                id: Number(id),
            });
            setDevice(data);
        })();
    }, [id]);

    return (
        <div className={styles.Device} data-testid="Device">
            {device && (
                <>
                    <div>id: {device.id}</div>
                    <div>name: {device.name}</div>
                    <div>ownerId: {device.ownerId}</div>
                    <div>deviceId: {device.deviceId}</div>
                    <div>createdAt: {device.createdAt}</div>
                    <div>editedAt: {device.editedAt || 'not yet edit'}</div>
                    <div>deletedAt: {device.deletedAt || 'not yet delete'}</div>
                    <div>info: {device.info || 'no info data'}</div>
                    <div>online: {device.online ? 'online' : 'offline'}</div>
                    <div>zone: {device.zone || 'no zone data'}</div>
                    <div>zoneId: {device.zone || 'no zoneId data'}</div>
                    <div>zoneId: {device.zone || 'no zoneId data'}</div>
                </>
            )}
            <Link to="../devices">Back to device list</Link>
        </div>
    );
};

export default Device;
