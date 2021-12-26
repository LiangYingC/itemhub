import React from 'react';
import styles from './DevicePinData.module.scss';
import { useParams, Link } from 'react-router-dom';

const DevicePinData = () => {
    let { id, pin } = useParams();
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
