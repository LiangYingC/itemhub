import styles from './devices.module.scss';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@/hooks/query.hook';
import { useAppSelector } from '@/hooks/redux.hook';
import { useRefreshDevices } from '@/hooks/apis/devices.hook';
import { selectDevices } from '@/redux/reducers/devices.reducer';

const Devices = () => {
    const query = useQuery();
    const page = Number(query.get('page') || 1);
    const limit = Number(query.get('limit') || 20);
    const devices = useAppSelector(selectDevices);

    const { isLoading, refreshDevices } = useRefreshDevices({
        page,
        limit,
    });

    useEffect(() => {
        if (!isLoading) {
            refreshDevices();
        }
    }, []);

    return (
        // UI 結構等設計稿後再重構調整
        <div className={styles.devices} data-testid="Devices">
            {isLoading || devices === null ? (
                <div>Loading</div>
            ) : (
                devices.map(({ id, name, createdAt }) => (
                    <div key={id}>
                        <table>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>CreateTime</th>
                            </tr>
                            <tr>
                                <td>{id}</td>
                                <td>{name}</td>
                                <td>{createdAt}</td>
                            </tr>
                            <tr>
                                <Link to={`/dashboard/devices/${id}`}>
                                    Go to {name} detail page
                                </Link>
                            </tr>
                        </table>
                    </div>
                ))
            )}
            <button onClick={refreshDevices}>refresh device list</button>
        </div>
    );
};

export default Devices;
