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
            Device Component: Id: {id}
            {JSON.stringify(device)}
            <br />
            <Link to="../devices">Back</Link>
        </div>
    );
};

export default Device;
