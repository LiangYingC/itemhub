import { useRef, useEffect, useState } from 'react';
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
import Pagination from '@/components/pagination/pagination';
import SearchInput from '@/components/Inputs/search-input/search-input';
import EmptyDataToCreateItem from '@/components/empty-data-to-create-item/empty-data-to-create-item';
import { useDeleteDevicesApi } from '@/hooks/apis/devices.hook';
import { RESPONSE_STATUS } from '@/constants/api';

const Devices = () => {
    const query = useQuery();
    const page = Number(query.get('page') || 1);
    const limit = Number(query.get('limit') || 10);

    const [deviceName, setDeviceName] = useState(query.get('deviceName') || '');
    const [shouldBeDeleteId, setShouldBeDeleteId] = useState(0);
    const [refreshFlag, setRefreshFlag] = useState(false);
    const devicesState = useAppSelector(selectDevices);
    const hasDevicesRef = useRef(false);
    const devices = devicesState.devices;
    const rowNum = devicesState.rowNum;

    const navigate = useNavigate();

    const { isGetingDevices, getDevicesApi } = useGetDevicesApi({
        page,
        limit,
        name: deviceName,
    });

    const {
        isLoading: isDeleting,
        fetchApi: deleteMultipleApi,
        data: responseOfDelete,
    } = useDeleteDevicesApi([shouldBeDeleteId]);

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

    const refresh = () => {
        getDevicesApi();
    };

    const jumpToCreatePage = () => {
        navigate('create');
    };

    const deleteOne = (id: number) => {
        if (prompt('請輸入 delete') !== 'delete') {
            return;
        }
        setShouldBeDeleteId(() => {
            return id;
        });
    };

    return (
        <div className="devices" data-testid="devices">
            <PageTitle
                title="裝置列表"
                primaryButtonVisible
                secondaryButtonVisible
                primaryButtonWording="重新整理"
                primaryButtonClassName="bg-black bg-opacity-10 text-black text-opacity-65 border border-black border-opacity-10"
                primaryButtonCallback={refresh}
                secondaryButtonWording="新增裝置"
                secondaryButtonCallback={jumpToCreatePage}
            />
            <div className="bg-white shadow-sm mx-3 mx-sm-0 mx-xl-45 mt-4 mt-sm-0 p-3 p-sm-45 rounded-8">
                <SearchInput
                    placeholder="搜尋裝置"
                    updateValue={(value) => setDeviceName(value)}
                    onSearch={getDevicesApi}
                />
                {isGetingDevices || devices === null ? (
                    <div>Loading</div>
                ) : (
                    <>
                        {!hasDevicesRef.current ? (
                            <EmptyDataToCreateItem itemName="裝置" />
                        ) : (
                            <div className="mt-3 mt-sm-45">
                                <div className="d-none d-sm-block">
                                    <div className="row bg-black bg-opacity-5 text-black text-opacity-45 h6 py-25 px-3 m-0">
                                        <div className="col-3">
                                            裝置名稱 / ID
                                        </div>
                                        <div className="col-2">狀態</div>
                                        <div className="col-2">建立時間</div>
                                        <div className="col-3">Pins Data</div>
                                        <div className="col-2">操作</div>
                                    </div>
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
                                                className="row border-bottom border-black border-opacity-10 p-0 py-sm-4 px-sm-3 mx-0"
                                                key={id}
                                                title={`建立時間: ${createdAt}`}
                                            >
                                                <div className="col-12 col-sm-3 row text-break mx-0 px-0 px-sm-25">
                                                    <div className="d-sm-none col-4 bg-black bg-opacity-5 text-black text-opacity-45 p-3">
                                                        裝置名稱 / ID
                                                    </div>
                                                    <div className="col-8 col-sm-12 p-3 p-sm-0">
                                                        <h5 className="lh-base mb-2 mb-sm-0">
                                                            {name}
                                                        </h5>
                                                        <h6 className="lh-base mb-0 text-black text-opacity-45">
                                                            {deviceId}
                                                        </h6>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-2 row mx-0 px-0 px-sm-25 flex-shrink-0">
                                                    <div className="d-sm-none col-4 bg-black bg-opacity-5 text-black text-opacity-45 p-3">
                                                        狀態
                                                    </div>
                                                    <div className="col-8 col-sm-12 p-3 p-sm-0">
                                                        <div
                                                            className={`rounded-pill tag text-center py-1 d-flex align-items-center justify-content-center ${
                                                                online
                                                                    ? 'bg-green bg-opacity-10 text-green'
                                                                    : 'bg-black bg-opacity-5 text-black text-opacity-45 fw-normal'
                                                            }`}
                                                        >
                                                            <div
                                                                className={`dot rounded-circle d-block me-2 ${
                                                                    online
                                                                        ? 'bg-green'
                                                                        : 'bg-black bg-opacity-45'
                                                                }`}
                                                            />
                                                            <div className="h6 mb-0">
                                                                {online
                                                                    ? '上線'
                                                                    : '離線'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-2 row text-black text-opacity-65 h6 mb-0 mx-0 px-0 px-sm-25">
                                                    <div className="d-sm-none col-4 bg-black bg-opacity-5 text-black text-opacity-45 p-3">
                                                        建立時間
                                                    </div>
                                                    <div className="col-8 col-sm-12 p-3 p-sm-0">
                                                        {moment(
                                                            createdAt
                                                        ).format(
                                                            'YYYY-MM-DD HH:mm'
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-3 row mx-0 px-0 px-sm-25">
                                                    <div className="d-sm-none col-4 bg-black bg-opacity-5 text-black text-opacity-45 p-3">
                                                        Pins Data
                                                    </div>
                                                    <div className="col-8 col-sm-12 p-3 p-sm-0">
                                                        <Pins
                                                            deviceId={Number(
                                                                id
                                                            )}
                                                            isEditMode={false}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-2 row d-flex align-item-center justify-content-start mx-0 px-0 px-sm-25">
                                                    <div className="d-sm-none col-4 bg-black bg-opacity-5 text-black text-opacity-45 p-3">
                                                        操作
                                                    </div>
                                                    <div className="col-8 col-sm-12 p-3 p-sm-25 d-flex flex-wrap">
                                                        <Link
                                                            className="me-4 mb-3"
                                                            to={`/dashboard/devices/${id}`}
                                                        >
                                                            <img
                                                                className="icon"
                                                                src={pencilIcon}
                                                            />
                                                        </Link>
                                                        <div
                                                            className="me-4 mb-3"
                                                            role="button"
                                                        >
                                                            <img
                                                                className="icon"
                                                                src={cloudIcon}
                                                            />
                                                        </div>
                                                        <div
                                                            className="me-4 mb-3"
                                                            role="button"
                                                            onClick={() => {
                                                                deleteOne(id);
                                                            }}
                                                        >
                                                            <img
                                                                className="icon"
                                                                src={trashIcon}
                                                            />
                                                        </div>
                                                    </div>
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
