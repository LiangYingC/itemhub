import styles from './device.module.scss';
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGetDeviceApi, useUpdateDeviceApi } from '@/hooks/apis/devices.hook';
import { DeviceItem } from '@/types/devices.type';
import { useAppSelector } from '@/hooks/redux.hook';
import { selectDevices } from '@/redux/reducers/devices.reducer';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Pins from '@/components/pins/pins';

const initialEditedData = {
    deviceId: '',
    name: '',
    info: '',
};

const Device = () => {
    const { id } = useParams();
    const numId = Number(id);
    const devices = useAppSelector(selectDevices);
    const device = devices?.filter((device) => device.id === numId)[0] || null;

    const [isShowModal, setIsShowModal] = useState(false);
    const [editedData, setEditedData] =
        useState<Partial<DeviceItem>>(initialEditedData);

    const { isLoading, getDeviceApi } = useGetDeviceApi({
        id: numId,
    });
    const { updateDeviceApi } = useUpdateDeviceApi({
        id: numId,
        editedData: editedData,
    });

    useEffect(() => {
        if (device === null) {
            getDeviceApi();
        }
    }, []);

    const closeModal = () => {
        setIsShowModal(false);
    };

    const updateDeviceData = () => {
        updateDeviceApi();
        setEditedData(initialEditedData);
        closeModal();
    };

    return (
        // UI 結構等設計稿後再重構調整
        <div className={styles.device} data-testid="device">
            {isLoading || device === null ? (
                <div>Loading</div>
            ) : (
                <div>
                    <div>
                        <h2>Device Data</h2>
                        <div>id: {device.id}</div>
                        <div>name: {device.name}</div>
                        <div>ownerId: {device.ownerId}</div>
                        <div>deviceId: {device.deviceId}</div>
                        <div>createdAt: {device.createdAt}</div>
                        <div>editedAt: {device.editedAt || 'not yet edit'}</div>
                        <div>
                            deletedAt: {device.deletedAt || 'not yet delete'}
                        </div>
                        <div>info: {device.info || 'no info data'}</div>
                        <div>
                            online: {device.online ? 'online' : 'offline'}
                        </div>
                        <div>zone: {device.zone || 'no zone data'}</div>
                        <div>zoneId: {device.zone || 'no zoneId data'}</div>
                    </div>
                    <button onClick={() => setIsShowModal(true)}>
                        edit data
                    </button>
                    <div>
                        <h2>Pins Data</h2>
                        <Pins />
                    </div>
                </div>
            )}
            <Modal show={isShowModal} onHide={closeModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edited Modal</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <label className="d-block">
                        <div>deviceId:</div>
                        <input
                            type="text"
                            name="deviceId"
                            onChange={(e) =>
                                setEditedData((prev) => {
                                    return {
                                        ...prev,
                                        deviceId: e.target.value,
                                    };
                                })
                            }
                        />
                    </label>
                    <label className="d-block">
                        <div>name:</div>
                        <input
                            type="text"
                            name="name"
                            onChange={(e) =>
                                setEditedData((prev) => {
                                    return {
                                        ...prev,
                                        name: e.target.value,
                                    };
                                })
                            }
                        />
                    </label>
                    <label className="d-block">
                        <div>info:</div>
                        <input
                            type="text"
                            name="info"
                            onChange={(e) =>
                                setEditedData((prev) => {
                                    return {
                                        ...prev,
                                        info: e.target.value,
                                    };
                                })
                            }
                        />
                    </label>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={updateDeviceData}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
            <div>
                <Link to="../devices">Back to device list</Link>
            </div>
        </div>
    );
};

export default Device;
