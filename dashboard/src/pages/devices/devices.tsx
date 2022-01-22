import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DeviceDataservice } from '../../dataservices/device.dataservice';
import { CookieHelper } from '../../helpers/cookie.helper';
import styles from './devices.module.scss';
import { useQuery } from '../../hooks/query.hook';
import { LogContext } from '../../contexts/logs.context';

const Devices = () => {
    let [devices, setDevices] = useState<{ name: string; id: number }[] | []>(
        []
    );
    let query = useQuery();
    const { logs, addLog } = useContext(LogContext);

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
            <br />
            <hr />
            <br />
            <button onClick={() => addLog('aaaa')}>test add log</button>
            <h1>Logs</h1>
            {logs.map((log, index) => (
                <div key={`log-${index}`}>aaa{log}aaa</div>
            ))}
        </div>
    );
};

export default Devices;
