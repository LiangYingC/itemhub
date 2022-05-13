import { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    useDeleteDevicesApi,
    useGetDeviceApi,
    useUpdateDeviceApi,
    useBundleFirmwareApi,
} from '@/hooks/apis/devices.hook';
import { useDownloadFirmwareApi } from '@/hooks/apis/firmware.hook';
import { useAppSelector } from '@/hooks/redux.hook';
import { selectDevices } from '@/redux/reducers/devices.reducer';
import Pins from '@/components/pins/pins';
import { RESPONSE_STATUS } from '@/constants/api';
import PageTitle from '@/components/page-title/page-title';
import { useDispatch } from 'react-redux';
import { dialogActions, DialogTypeEnum } from '@/redux/reducers/dialog.reducer';
import trashIcon from '@/assets/images/trash.svg';
import {
    toasterActions,
    ToasterTypeEnum,
} from '@/redux/reducers/toaster.reducer';
import moment from 'moment';
import cloudIcon from '@/assets/images/cloud.svg';
import compassIcon from '@/assets/images/compass.svg';
import { selectUniversal } from '@/redux/reducers/universal.reducer';

const Device = () => {
    const { id: idFromUrl } = useParams();
    const id: number | null = idFromUrl ? Number(idFromUrl) : null;

    const devices = useAppSelector(selectDevices).devices;

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const device =
        (devices || []).filter((device) => device.id === Number(id))[0] || null;

    const [deviceName, setDeviceName] = useState<string>('');

    const { isLoading: isGetting, fetchApi: getDeviceApi } = useGetDeviceApi(
        Number(id)
    );

    const [downloadIcon, setDownloaIcon] = useState<string>(cloudIcon);
    const [isFirmwarePrepare, setIsFirmwarePrepare] = useState(false);
    const [shouldBeBundledId, setShouldBeBundledId] = useState(0);
    const [downloadBundleId, setDownloadBundleId] = useState('');
    const retryDownloadFirmwareCountRef = useRef(0);
    const retryDownloadFirmwareLimit = 10;
    const [retryDownloadFirmwareFlag, setRetryDownloadFirmwareFlag] =
        useState(false);
    const { microcontrollers } = useAppSelector(selectUniversal);

    const { updateDeviceApi, isLoading: isUpdating } = useUpdateDeviceApi({
        id: Number(id),
        editedData: {
            name: deviceName,
            deviceId: device?.deviceId,
        },
    });

    const { fetchApi: deleteApi, data: deleteDeviceResponse } =
        useDeleteDevicesApi([Number(id)]);

    const backToList = () => {
        navigate('/dashboard/devices');
    };

    const jumpToEditPage = () => {
        navigate('edit');
    };

    const bundleFirmware = () => {
        if (isFirmwarePrepare) {
            return;
        }
        setDownloaIcon(compassIcon);
        setShouldBeBundledId(Number(id));
    };

    const {
        fetchApi: bundleFirmwareApi,
        error: errorOfBundle,
        data: responseOfBundle,
    } = useBundleFirmwareApi({ id: shouldBeBundledId });

    const {
        fetchApi: downloadFirmwareApi,
        httpStatus: downloadFirmwareHttpStatus,
        data: responseOfDownloadFirmware,
    } = useDownloadFirmwareApi({ bundleId: downloadBundleId });

    useEffect(() => {
        if (device === null) {
            getDeviceApi();
        }
    }, []);

    useEffect(() => {
        setDeviceName(device ? device.name : '');
    }, [device]);

    useEffect(() => {
        if (deleteDeviceResponse?.status === RESPONSE_STATUS.OK) {
            dispatch(
                toasterActions.pushOne({
                    message: `已經成功刪除 ${deviceName} `,
                    duration: 5,
                    type: ToasterTypeEnum.INFO,
                })
            );
            navigate('/dashboard/devices', { replace: true });
        }
    }, [deleteDeviceResponse]);

    useEffect(() => {
        if (shouldBeBundledId) {
            setIsFirmwarePrepare(true);
            bundleFirmwareApi();
        }
    }, [shouldBeBundledId]);

    useEffect(() => {
        if (errorOfBundle && errorOfBundle.message) {
            alert(errorOfBundle.message);
            setIsFirmwarePrepare(false);
            return;
        }
        if (responseOfBundle?.bundleId) {
            setIsFirmwarePrepare(true);
            setDownloadBundleId(responseOfBundle.bundleId);
        }
    }, [responseOfBundle, errorOfBundle]);

    useEffect(() => {
        if (downloadBundleId) {
            downloadFirmwareApi();
        }
    }, [downloadBundleId, retryDownloadFirmwareFlag]);

    useEffect(() => {
        if (downloadFirmwareHttpStatus === 204) {
            retryDownloadFirmwareCountRef.current += 1;
            if (
                retryDownloadFirmwareCountRef.current >
                retryDownloadFirmwareLimit
            ) {
                alert(
                    '伺服器目前過於忙碌, 已經超過預期打包的時間, 請稍候再嘗試下載'
                );
                retryDownloadFirmwareCountRef.current = 0;
                setIsFirmwarePrepare(false);
                setDownloaIcon(cloudIcon);
                setShouldBeBundledId(0);
                return;
            }
            setTimeout(() => {
                setRetryDownloadFirmwareFlag(!retryDownloadFirmwareFlag);
            }, 3000);
        } else if (downloadFirmwareHttpStatus === 200) {
            setIsFirmwarePrepare(false);
            setDownloaIcon(cloudIcon);
            setShouldBeBundledId(0);
            retryDownloadFirmwareCountRef.current = 0;

            dispatch(
                toasterActions.pushOne({
                    message: '程式碼已成功打包下載',
                    duration: 5,
                    type: ToasterTypeEnum.INFO,
                })
            );
        }
    }, [responseOfDownloadFirmware]);

    const deleteDevice = () => {
        dispatch(
            dialogActions.open({
                message: `刪除後將無法復原, 請輸入 DELETE 完成刪除 ${deviceName} `,
                title: '確認刪除裝置 ?',
                type: DialogTypeEnum.PROMPT,
                checkedMessage: 'DELETE',
                callback: deleteApi,
                promptInvalidMessage: '輸入錯誤',
            })
        );
    };

    const bundleDevice = () => {
        dispatch(
            dialogActions.open({
                message: `Client ID 會被重新建立，舊有程式碼將無法使用，請確認是否重新打包？`,
                title: '重新打包程式碼',
                type: DialogTypeEnum.CONFIRM,
                callback: bundleFirmware,
            })
        );
    };

    return (
        // UI 結構等設計稿後再重構調整
        <div className="device" data-testid="device">
            <PageTitle
                titleClickCallback={backToList}
                titleBackIconVisible
                title={`${deviceName}詳細內容`}
                primaryButtonVisible
                primaryButtonWording="編輯"
                primaryButtonCallback={jumpToEditPage}
                secondaryButtonIcon={downloadIcon}
                secondaryButtonVisible
                secondaryButtonWording="打包程式碼"
                secondaryButtonCallback={bundleDevice}
                thirdlyButtonIcon={trashIcon}
                thirdlyButtonVisible
                thirdlyButtonWording="刪除"
                thirdlyButtonCallback={deleteDevice}
            />
            {isGetting || device === null ? (
                <div>Loading</div>
            ) : (
                <div className="card">
                    <div className="row m-0">
                        <div className="col-12 col-lg-6 d-flex p-0 item">
                            <div className="d-flex fs-5 text-black text-opacity-45 bg-black bg-opacity-5 item-title py-2 px-25">
                                Device Id
                            </div>
                            <div className="text-break text-black text-opacity-65 py-2 px-25">
                                {device.deviceId}
                            </div>
                        </div>
                        <div className="col-12 col-lg-6 d-flex p-0 item">
                            <div className="d-flex fs-5 bg-black bg-opacity-5 text-black text-opacity-45 item-title py-2 px-25">
                                狀態
                            </div>
                            <div className="py-2 px-25">
                                <div
                                    className={`tag fs-5 ${
                                        device.online ? 'tag-green' : 'tag-grey'
                                    }`}
                                >
                                    <div>{device.online ? '上線' : '離線'}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-lg-6 d-flex p-0 item">
                            <div className="d-flex fs-5 bg-black bg-opacity-5 text-black text-opacity-45 item-title py-2 px-25">
                                建立時間
                            </div>
                            <div className="text-wrap text-black text-opacity-65 py-2 px-25">
                                {` ${moment(device.createdAt).format(
                                    'YYYY-MM-DD HH:mm'
                                )}`}
                            </div>
                        </div>
                        <div className="col-12 col-lg-6 d-flex p-0 item">
                            <div className="d-flex fs-5 bg-black bg-opacity-5 text-black text-opacity-45 item-title py-2 px-25">
                                裝置類型
                            </div>
                            <div className="text-wrap text-black text-opacity-65 py-2 px-25">
                                {
                                    microcontrollers[device.microcontroller]
                                        ?.label
                                }
                            </div>
                        </div>
                        <div className="col-12 col-lg-6 d-flex p-0 item">
                            <div className="d-flex fs-5 bg-black bg-opacity-5 text-black text-opacity-45 item-title py-2 px-25">
                                Pins Data
                            </div>
                            <div className="text-wrap text-black text-opacity-65 py-2 px-25">
                                <Pins
                                    deviceId={Number(id)}
                                    isEditMode={false}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Device;
