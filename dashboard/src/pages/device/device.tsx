import styles from './device.module.scss';
import { Link, useParams } from 'react-router-dom';
import { useGetDeviceItem } from '@/hooks/apis/devices.hook';

const Device = () => {
    const { id } = useParams();
    const { isLoading, deviceItem } = useGetDeviceItem({
        id: Number(id),
    });

    return (
        <div className={styles.Device} data-testid="Device">
            {isLoading || deviceItem === null ? (
                <div>Loading</div>
            ) : (
                <>
                    <div>id: {deviceItem.id}</div>
                    <div>name: {deviceItem.name}</div>
                    <div>ownerId: {deviceItem.ownerId}</div>
                    <div>deviceId: {deviceItem.deviceId}</div>
                    <div>createdAt: {deviceItem.createdAt}</div>
                    <div>editedAt: {deviceItem.editedAt || 'not yet edit'}</div>
                    <div>
                        deletedAt: {deviceItem.deletedAt || 'not yet delete'}
                    </div>
                    <div>info: {deviceItem.info || 'no info data'}</div>
                    <div>
                        online: {deviceItem.online ? 'online' : 'offline'}
                    </div>
                    <div>zone: {deviceItem.zone || 'no zone data'}</div>
                    <div>zoneId: {deviceItem.zone || 'no zoneId data'}</div>
                    <div>zoneId: {deviceItem.zone || 'no zoneId data'}</div>
                </>
            )}
            <Link to="../devices">Back to deviceItem list</Link>
        </div>
    );
};

export default Device;
