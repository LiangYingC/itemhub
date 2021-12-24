import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DeviceDataservice } from '../../dataservices/device.dataservice';
import { CookieHelper } from '../../helpers/cookie.helper';
import styles from './Devices.module.scss';
import { useQuery } from '../../hooks/query.hook';

const Devices = () => {
    let [devices, setDevices] = useState<{ name: string; id: number }[] | []>(
        []
    );
    let query = useQuery();
    useEffect(() => {
        (async () => {
            const page = Number(query.get('page') || 1);
            const limit = Number(query.get('limit') || 20);
            const token = CookieHelper.GetCookie('token') || '';
            const data: any = await DeviceDataservice.GetList(
                token,
                page,
                limit
            );
            setDevices(data.devices);
        })();

        return () => {
            setDevices([]);
        };
    }, [query.get('page'), query.get('limit')]);

    return (
        <div className={styles.Devices} data-testid="Devices">
            {devices.map((item) => (
                <div key={item.id}>
                    <Link to={`/devices/${item.id}`}>{item.name}</Link> <br />
                </div>
            ))}
        </div>
    );
};

export default Devices;
