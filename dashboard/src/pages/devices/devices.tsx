import styles from './devices.module.scss';
import { Link } from 'react-router-dom';
import { useQuery } from '@/hooks/query.hook';
import { useDeviceList } from '@/hooks/api/devices.hook';

const Devices = () => {
    const query = useQuery();
    const page = Number(query.get('page') || 1);
    const limit = Number(query.get('limit') || 20);
    const { isLoading, deviceList, fetchDeviceList } = useDeviceList({
        page,
        limit,
    });

    return (
        <div className={styles.devices} data-testid="Devices">
            {isLoading ? (
                <div>Loading</div>
            ) : (
                deviceList?.map(({ id, name, createdAt }) => (
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
            <button onClick={fetchDeviceList}>refresh device list</button>
        </div>
    );
};

export default Devices;
