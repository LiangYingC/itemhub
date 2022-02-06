import styles from './devices.module.scss';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@/hooks/query.hook';
import { useAppSelector } from '@/hooks/redux.hook';
import { useGetDeviceList } from '@/hooks/apis/devices.hook';
import { selectDevices } from '@/redux/reducers/devices.reducer';

const Devices = () => {
    const query = useQuery();
    const page = Number(query.get('page') || 1);
    const limit = Number(query.get('limit') || 20);
    const devices = useAppSelector(selectDevices);

    const { isLoading, refreshDeviceList } = useGetDeviceList({
        page,
        limit,
    });

    useEffect(() => {
        refreshDeviceList();
    }, []);

    return (
        <div className={styles.devices} data-testid="Devices">
            {isLoading ? (
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
            <button onClick={refreshDeviceList}>refresh device list</button>
        </div>
    );
};

export default Devices;
