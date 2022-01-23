import styles from './device-pin-data.module.scss';
import { useParams, Link } from 'react-router-dom';

const DevicePinData = () => {
    const { id, pin } = useParams();
    return (
        <div className={styles.DevicePinData} data-testid="DevicePinData">
            DevicePinData Component
            <br />
            Id: {id}
            <br />
            Pin: {pin}
            <br />
            <Link to="../devices">Back</Link>
        </div>
    );
};

export default DevicePinData;
