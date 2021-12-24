import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from './Device.module.scss';
import { CookieHelper } from '../../helpers/cookie.helper';
import { DeviceDataservice } from '../../dataservices/device.dataservice';

const Device = () => {
    let { id } = useParams();
    let [device, setDevice] = useState<{ name: string; id: number } | null>(
        null
    );
    useEffect(() => {
        (async () => {
            const token = CookieHelper.GetCookie('token') || '';
            const data: any = await DeviceDataservice.GetOne(token, Number(id));
            setDevice(data);
        })();

        return () => {
            setDevice(null);
        };
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
