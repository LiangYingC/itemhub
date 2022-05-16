import { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@/hooks/query.hook';
import { useAppSelector } from '@/hooks/redux.hook';
import {
    useBundleFirmwareApi,
    useGetDevicesApi,
} from '@/hooks/apis/devices.hook';
import { selectDevices } from '@/redux/reducers/devices.reducer';
import Pins from '@/components/pins/pins';
import PageTitle from '@/components/page-title/page-title';
import moment from 'moment';
import pencilIcon from '@/assets/images/pencil.svg';
import cloudIcon from '@/assets/images/cloud.svg';
import trashIcon from '@/assets/images/trash.svg';
import Pagination from '@/components/pagination/pagination';
import SearchInput from '@/components/inputs/search-input/search-input';
import EmptyDataToCreateItem from '@/components/empty-data-to-create-item/empty-data-to-create-item';
import { useDeleteDevicesApi } from '@/hooks/apis/devices.hook';
import { RESPONSE_STATUS } from '@/constants/api';
import { useDownloadFirmwareApi } from '@/hooks/apis/firmware.hook';
import compassIcon from '@/assets/images/compass.svg';
import stopIcon from '@/assets/images/stop.svg';
import { useDispatch } from 'react-redux';
import { dialogActions, DialogTypeEnum } from '@/redux/reducers/dialog.reducer';
import ReactTooltip from 'react-tooltip';
import OnlineStatusTag from '@/components/online-status-tag/online-status-tag';
import Spinner from '@/components/spinner/spinner';

const Devices = () => {
    const query = useQuery();
    const retryDownloadFirmwareLimit = 10;

    const page = Number(query.get('page') || 1);
    const limit = Number(query.get('limit') || 10);

    const [deviceName, setDeviceName] = useState(query.get('deviceName') || '');
    const [shouldBeDeleteId, setShouldBeDeleteId] = useState(0);
    const [shouldBeBundledId, setShouldBeBundledId] = useState(0);
    const [downloadBundleId, setDownloadBundleId] = useState('');
    const [retryDownloadFirmwareFlag, setRetryDownloadFirmwareFlag] =
        useState(false);
    const [refreshFlag, setRefreshFlag] = useState(false);
    const [isFirmwarePrepare, setIsFirmwarePrepare] = useState(false);
    const devicesState = useAppSelector(selectDevices);
    const dispatch = useDispatch();
    const hasDevicesRef = useRef(false);
    const retryDownloadFirmwareCountRef = useRef(0);
    const devices = devicesState.devices;
    const rowNum = devicesState.rowNum;

    const navigate = useNavigate();

    const { isGetingDevices, getDevicesApi } = useGetDevicesApi({
        page,
        limit,
        name: deviceName,
    });

    const { fetchApi: deleteMultipleApi, data: responseOfDelete } =
        useDeleteDevicesApi([shouldBeDeleteId]);

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
        if (devices && devices.length > 0) {
            hasDevicesRef.current = true;
        }
    }, [devices]);

    useEffect(() => {
        getDevicesApi();
    }, [page, refreshFlag]);

    useEffect(() => {
        if (shouldBeDeleteId) {
            deleteMultipleApi();
        }
    }, [shouldBeDeleteId]);

    useEffect(() => {
        if (responseOfDelete?.status === RESPONSE_STATUS.OK) {
            setRefreshFlag(!refreshFlag);
        }
    }, [responseOfDelete]);

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
                setShouldBeBundledId(0);
                setIsFirmwarePrepare(false);
                return;
            }
            setTimeout(() => {
                setRetryDownloadFirmwareFlag(!retryDownloadFirmwareFlag);
            }, 3000);
        } else if (downloadFirmwareHttpStatus === 200) {
            setShouldBeBundledId(0);
            setIsFirmwarePrepare(false);
            retryDownloadFirmwareCountRef.current = 0;
        }
    }, [responseOfDownloadFirmware]);

    const refresh = () => {
        getDevicesApi();
    };

    const jumpToCreatePage = () => {
        navigate('create');
    };

    const deleteOne = (id: number) => {
        const shouldBeDeleteDevice = (devices || []).find(
            (item) => item.id === id
        );
        if (!shouldBeDeleteDevice) {
            return;
        }
        dispatch(
            dialogActions.open({
                message: `刪除後將無法復原, 請輸入 DELETE 完成刪除 ${shouldBeDeleteDevice.name}`,
                title: '確認刪除裝置 ?',
                type: DialogTypeEnum.PROMPT,
                checkedMessage: 'DELETE',
                callback: () => {
                    setShouldBeDeleteId(() => {
                        return id;
                    });
                },
                promptInvalidMessage: '輸入錯誤',
            })
        );
    };

    const bundleFirmware = (id: number) => {
        setShouldBeBundledId(id);
    };

    return (
        <div className="devices" data-testid="devices">
            <PageTitle
                title="裝置列表"
                primaryButtonVisible={hasDevicesRef.current}
                primaryButtonWording="新增裝置"
                primaryButtonCallback={jumpToCreatePage}
                secondaryButtonVisible={hasDevicesRef.current}
                secondaryButtonWording="重新整理"
                secondaryButtonCallback={refresh}
            />
            <div className="card">
                {!hasDevicesRef.current && devices !== null ? (
                    <EmptyDataToCreateItem itemName="裝置" />
                ) : (
                    <>
                        <SearchInput
                            placeholder="搜尋裝置"
                            onChangeValue={(value) => setDeviceName(value)}
                            onSearch={getDevicesApi}
                        />
                        {isGetingDevices || devices === null ? (
                            <div className="w-100 d-flex justify-content-center my-4">
                                <Spinner />
                            </div>
                        ) : (
                            <div className="mt-3 mt-lg-45">
                                <div className="row bg-black bg-opacity-5 text-black text-opacity-45 fs-5 py-25 px-3 m-0 d-none d-lg-flex">
                                    <div className="col-3">裝置名稱 / ID</div>
                                    <div className="col-2">狀態</div>
                                    <div className="col-2">建立時間</div>
                                    <div className="col-3">Pins Data</div>
                                    <div className="col-2">操作</div>
                                </div>
                                <div className="devices-list">
                                    {devices.map(
                                        ({
                                            id,
                                            deviceId,
                                            name,
                                            createdAt,
                                            online,
                                        }) => (
                                            <div
                                                className="row list border-bottom border-black border-opacity-10 p-0 py-lg-4 px-lg-3 mx-0"
                                                key={id}
                                                title={`建立時間: ${createdAt}`}
                                            >
                                                <div className="col-4 d-lg-none bg-black bg-opacity-5 text-black text-opacity-45 p-3">
                                                    裝置名稱 / ID
                                                </div>
                                                <div className="col-8 col-lg-3 p-3 p-lg-0">
                                                    <div className="fw-bold lh-base mb-2 mb-lg-0">
                                                        {name}
                                                    </div>
                                                    <div className="fs-5 lh-base mb-0 text-black text-opacity-45">
                                                        {deviceId}
                                                    </div>
                                                </div>
                                                <div className="col-4 d-lg-none bg-black bg-opacity-5 text-black text-opacity-45 p-3">
                                                    狀態
                                                </div>
                                                <div className="col-8 col-lg-2 p-3 p-lg-0">
                                                    <OnlineStatusTag
                                                        isOnline={online}
                                                    />
                                                </div>
                                                <div className="col-4 d-lg-none bg-black bg-opacity-5 text-black text-opacity-45 p-3">
                                                    建立時間
                                                </div>
                                                <div className="col-8 col-lg-2 p-3 p-lg-0">
                                                    {moment(createdAt).format(
                                                        'YYYY-MM-DD HH:mm'
                                                    )}
                                                </div>
                                                <div className="col-4 d-lg-none bg-black bg-opacity-5 text-black text-opacity-45 p-3">
                                                    Pins Data
                                                </div>
                                                <div className="col-8 col-lg-3 p-3 p-lg-0">
                                                    <Pins
                                                        deviceId={Number(id)}
                                                        isEditMode={false}
                                                    />
                                                </div>
                                                <div className="col-4 d-lg-none bg-black bg-opacity-5 text-black text-opacity-45 p-3">
                                                    操作
                                                </div>
                                                <div className="col-8 col-lg-2 p-3 p-lg-25 d-flex flex-wrap">
                                                    <Link
                                                        className="me-4 mb-3"
                                                        to={`/dashboard/devices/${id}`}
                                                        data-tip="編輯"
                                                    >
                                                        <img
                                                            className="icon"
                                                            src={pencilIcon}
                                                        />
                                                    </Link>
                                                    <div
                                                        className="me-4 mb-3"
                                                        role="button"
                                                        onClick={() => {
                                                            if (
                                                                isFirmwarePrepare
                                                            ) {
                                                                return;
                                                            }
                                                            bundleFirmware(id);
                                                        }}
                                                        data-tip="打包程式碼"
                                                    >
                                                        {isFirmwarePrepare &&
                                                        shouldBeBundledId ===
                                                            id ? (
                                                            <img
                                                                title="正在產生 firmware project"
                                                                className="icon"
                                                                src={
                                                                    compassIcon
                                                                }
                                                            />
                                                        ) : (
                                                            <div className="position-relative">
                                                                <img
                                                                    className="icon"
                                                                    src={
                                                                        cloudIcon
                                                                    }
                                                                />
                                                                <img
                                                                    className={`icon position-absolute ${
                                                                        isFirmwarePrepare &&
                                                                        shouldBeBundledId !==
                                                                            id
                                                                            ? ''
                                                                            : 'd-none'
                                                                    }`}
                                                                    src={
                                                                        stopIcon
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div
                                                        className="me-4 mb-3"
                                                        role="button"
                                                        onClick={() => {
                                                            deleteOne(id);
                                                        }}
                                                        data-tip="刪除"
                                                    >
                                                        <img
                                                            className="icon"
                                                            src={trashIcon}
                                                        />
                                                    </div>
                                                    <ReactTooltip effect="solid" />
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                                <div
                                    className={`${
                                        devices.length > 0 ? 'd-flex' : 'd-none'
                                    } justify-content-end w-100 mt-5`}
                                >
                                    <Pagination
                                        rowNum={rowNum}
                                        page={page}
                                        limit={limit}
                                    />
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Devices;
