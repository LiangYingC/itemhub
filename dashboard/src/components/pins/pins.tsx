import styles from './pins.module.scss';
import { useEffect } from 'react';
import { useGetDevicePinsApi } from '@/hooks/apis/devices.hook';
import Pin from '@/components/pin/pin';

const Pins = (props: { deviceId: number; isEditMode: boolean }) => {
    const { deviceId, isEditMode } = props;
    const { isLoading, devicePins, getDevicePinsApi } = useGetDevicePinsApi({
        id: Number(deviceId),
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
                    {devicePins.map((item) => (
                        <Pin
                            pinItem={item}
                            isEditMode={isEditMode}
                            key={`${item.deviceId}-${item.pin}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Pins;
