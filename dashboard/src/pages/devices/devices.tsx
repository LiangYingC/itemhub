import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@/hooks/query.hook';
import { useAppSelector } from '@/hooks/redux.hook';
import { useGetDevicesApi } from '@/hooks/apis/devices.hook';
import { selectDevices } from '@/redux/reducers/devices.reducer';
import Pins from '@/components/pins/pins';
import PageTitle from '@/components/page-title/page-title';
import moment from 'moment';
import pencilIcon from '@/assets/images/pencil.svg';
import cloudIcon from '@/assets/images/cloud.svg';
import trashIcon from '@/assets/images/trash.svg';

const Devices = () => {
    const query = useQuery();
    const page = Number(query.get('page') || 1);
    const limit = Number(query.get('limit') || 20);
    const devices = useAppSelector(selectDevices);
    const navigate = useNavigate();

    const { isLoading, getDevicesApi } = useGetDevicesApi({
        page,
        limit,
    });

    useEffect(() => {
        getDevicesApi();
    }, []);

    const refresh = () => {
        getDevicesApi();
    };

    const jumpToCreatePage = () => {
        navigate('create');
    };

    return (
        // UI 結構等設計稿後再重構調整
        <div className="devices" data-testid="Devices">
            <PageTitle
                title="裝置列表"
                primaryButtonVisible
                secondaryButtonVisible
                primaryButtonWording="重新整理"
                primaryButtonCallback={refresh}
                secondaryButtonWording="新增裝置"
                secondaryButtonCallback={jumpToCreatePage}
            />
            <div className="card mx-4 p-45">
                <div className="filter" />
                {isLoading || devices === null ? (
                    <div>Loading</div>
                ) : (
                    <>
                        <div className="row bg-black-opacity-04 text-black-opacity-45 h6 py-25 mb-0">
                            <div className="col-3">裝置名稱 / ID</div>
                            <div className="col-1">狀態</div>
                            <div className="col-2">建立時間</div>
                            <div className="col-3">Pins Data</div>
                            <div className="col-3">操作</div>
                        </div>
                        {devices.map(
                            ({ id, deviceId, name, createdAt, online }) => (
                                <div
                                    className="row py-4"
                                    key={id}
                                    title={`建立時間: ${createdAt}`}
                                >
                                    <div className="col-3">
                                        <h5 className="mb-0">{name}</h5>
                                        <h6 className="mb-0 text-black text-opacity-45">
                                            {deviceId}
                                        </h6>
                                    </div>
                                    <div className="col-1">
                                        <div
                                            className={`rounded-pill tag text-center py-1 d-flex align-items-center justify-content-center ${
                                                online
                                                    ? 'bg-green bg-opacity-10 text-green'
                                                    : 'bg-black bg-opacity-5 text-black text-opacity-45'
                                            }`}
                                        >
                                            <div
                                                className={`dot rounded-circle d-block me-2 ${
                                                    online
                                                        ? 'bg-green'
                                                        : 'bg-black bg-opacity-45'
                                                }`}
                                            />
                                            {online ? '上線' : '離線'}
                                        </div>
                                    </div>
                                    <div className="col-2">
                                        {moment(createdAt).format(
                                            'YYYY-MM-DD HH:mm'
                                        )}
                                    </div>
                                    <div className="col-3">
                                        <Pins
                                            deviceId={Number(id)}
                                            isEditMode={false}
                                        />
                                    </div>
                                    <div className="col-3 d-flex align-item-center justify-content-start">
                                        <Link
                                            className="me-4"
                                            to={`/dashboard/devices/${id}`}
                                        >
                                            <img
                                                className="icon"
                                                src={pencilIcon}
                                            />
                                        </Link>
                                        <div className="me-4" role="button">
                                            <img
                                                className="icon"
                                                src={cloudIcon}
                                            />
                                        </div>
                                        <div className="me-4" role="button">
                                            <img
                                                className="icon"
                                                src={trashIcon}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Devices;
