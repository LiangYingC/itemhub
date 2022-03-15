import styles from './pins.module.scss';
import { useEffect } from 'react';
import { useGetDevicePinsApi } from '@/hooks/apis/devices.hook';
import Pin from '../switch-pin/pin';

const Pins = (props: { id: number; isEditMode: boolean }) => {
    const { id, isEditMode } = props;
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
                <div>
                    {devicePins.map((pin) => (
                        <Pin
                            pinItem={pin}
                            isEditMode={isEditMode}
                            key={`${pin.deviceId}-${pin}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Pins;
