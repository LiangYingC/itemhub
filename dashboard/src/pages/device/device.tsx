import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    useDeleteDevicesApi,
    useGetDeviceApi,
    useUpdateDeviceApi,
} from '@/hooks/apis/devices.hook';
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
                secondaryButtonIcon={cloudIcon}
                secondaryButtonVisible
                secondaryButtonWording="打包程式碼"
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
                        <div className="col-12 col-md-6 d-flex p-0 item">
                            <div className="d-flex flex-shrink-0 fs-5 item-title py-2 px-25">
                                Device Id
                            </div>
                            <div className="text-wrap text-black text-opacity-65 py-2 px-25">
                                {device.deviceId}
                            </div>
                        </div>
                        <div className="col-12 col-md-6 d-flex p-0 item">
                            <div className="d-flex flex-shrink-0 fs-5 item-title py-2 px-25">
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
                        <div className="col-12 col-md-6 d-flex p-0 item">
                            <div className="d-flex flex-shrink-0 fs-5 item-title py-2 px-25">
                                建立時間
                            </div>
                            <div className="text-wrap text-black text-opacity-65 py-2 px-25">
                                {` ${moment(device.createdAt).format(
                                    'YYYY-MM-DD HH:mm'
                                )}`}
                            </div>
                        </div>
                        <div className="col-12 p-0 item">
                            <div className="col-12 col-md-6 d-flex p-0">
                                <div className="d-flex flex-shrink-0 fs-5 item-title py-2 px-25">
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
                </div>
            )}
        </div>
    );
};

export default Device;
