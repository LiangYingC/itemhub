import styles from './pins.module.scss';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetDevicePinsApi } from '@/hooks/apis/devices.hook';

const Pins = () => {
    const { id } = useParams();
    const { isLoading, devicePins, getDevicePinsApi } = useGetDevicePinsApi({
        id: Number(id),
    });

    useEffect(() => {
        getDevicePinsApi();
    }, []);

    return (
        // UI 結構等設計稿後再重構調整
        <div className={styles.pins} data-testid="Pins">
            {isLoading || devicePins === null ? (
                <div>Loading</div>
            ) : (
                devicePins.map(({ deviceId, pin, state }) => (
                    <div key={deviceId}>
                        <div>deviceId: {deviceId}</div>
                        <div>pin: {pin}</div>
                        <div>state: {state}</div>
                    </div>
                ))
            )}
            <button onClick={getDevicePinsApi}>refresh pin list</button>
        </div>
    );
};

export default Pins;
