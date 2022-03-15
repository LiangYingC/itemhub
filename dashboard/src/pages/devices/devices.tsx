import styles from './devices.module.scss';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@/hooks/query.hook';
import { useAppSelector } from '@/hooks/redux.hook';
import { useGetDevicesApi } from '@/hooks/apis/devices.hook';
import { selectDevices } from '@/redux/reducers/devices.reducer';
import Pins from '@/components/pins/pins';

const Devices = () => {
    const query = useQuery();
    const page = Number(query.get('page') || 1);
    const limit = Number(query.get('limit') || 20);
    const devices = useAppSelector(selectDevices);

    const { isLoading, getDevicesApi } = useGetDevicesApi({
        page,
        limit,
    });

    useEffect(() => {
        getDevicesApi();
    }, []);

    return (
        // UI 結構等設計稿後再重構調整
        <div className={`${styles.devices} `} data-testid="Devices">
            {isLoading || devices === null ? (
                <div>Loading</div>
            ) : (
                devices.map(({ id, name, createdAt, online }) => (
                    <div
                        className="mb-3 border w-50"
                        key={id}
                        title={`建立時間: ${createdAt}`}
                    >
                        <div className="d-flex">
                            <div className="me-3">{name}</div>
                            <div className="me-3">
                                {online ? '在線' : '離線'}
                            </div>
                            <Link to={`/dashboard/devices/${id}`}>編輯</Link>
                        </div>

                        <Pins id={Number(id)} isEditMode={false} />
                    </div>
                ))
            )}
            <button onClick={getDevicesApi}>refresh device list</button>
        </div>
    );
};

export default Devices;
