import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { RESPONSE_STATUS } from '@/constants/api';
import { useQuery } from '@/hooks/query.hook';
import { useAppSelector } from '@/hooks/redux.hook';
import {
    useGetTriggersApi,
    useDeleteTriggersApi,
} from '@/hooks/apis/triggers.hook';
import { selectTriggers } from '@/redux/reducers/triggers.reducer';
import { selectUniversal } from '@/redux/reducers/universal.reducer';
import { ArrayHelpers } from '@/helpers/array.helper';
import { TriggerItem } from '@/types/triggers.type';
import Pagination from '@/components/pagination/pagination';
import PageTitle from '@/components/page-title/page-title';
import SearchInput from '@/components/input/search-input/search-input';
import EmptyDataToCreateItem from '@/components/empty-data-to-create-item/empty-data-to-create-item';
import lightTrashIcon from '@/assets/images/light-trash.svg';
import pencilIcon from '@/assets/images/pencil.svg';
import trashIcon from '@/assets/images/trash.svg';

const filterTriggers = ({
    triggers,
    sourceDeviceNameFilter,
    destinationDeviceNameFilter,
}: {
    triggers: TriggerItem[] | null;
    sourceDeviceNameFilter: string;
    destinationDeviceNameFilter: string;
}) => {
    if (triggers === null) {
        return [];
    }
    const filteredTriggers = triggers.filter(
        ({ sourceDevice, destinationDevice }) => {
            const sourceDeviceName = sourceDevice?.name;
            const destinationDeviceName = destinationDevice?.name;
            const isReserved =
                (sourceDeviceNameFilter === '' &&
                    destinationDeviceNameFilter === '') ||
                sourceDeviceNameFilter === sourceDeviceName ||
                destinationDeviceNameFilter === destinationDeviceName;
            return isReserved;
        }
    );
    return filteredTriggers;
};

const Triggers = () => {
    const navigate = useNavigate();
    const query = useQuery();
    const limit = Number(query.get('limit') || 5);
    const page = Number(query.get('page') || 1);

    const [triggerName, setTriggerName] = useState(query.get('name') || '');
    const { triggerOperators } = useAppSelector(selectUniversal);

    const sourceDeviceNameOptionsRef = useRef<string[]>([]);
    const destinationDeviceNameOptionsRef = useRef<string[]>([]);
    const sourceDeviceNameOptions = ArrayHelpers.FilterDuplicatedString(
        sourceDeviceNameOptionsRef.current
    );
    const destinationDeviceNameOptions = ArrayHelpers.FilterDuplicatedString(
        destinationDeviceNameOptionsRef.current
    );

    const { triggers, rowNum } = useAppSelector(selectTriggers);
    const hasTriggersRef = useRef(false);

    useEffect(() => {
        if (triggers && triggers.length > 0) {
            hasTriggersRef.current = true;
        }
    }, [triggers]);

    useEffect(() => {
        if (
            triggers &&
            sourceDeviceNameOptions.length === 0 &&
            destinationDeviceNameOptions.length === 0
        ) {
            const initialOptions = {
                sourceDeviceNames: ['來源裝置名稱'],
                destinationDeviceNames: ['目標裝置名稱'],
            };

            const options = triggers.reduce((accumOptions, currentTrigger) => {
                const sourceDeviceName = currentTrigger.sourceDevice?.name;
                const destinationDeviceName =
                    currentTrigger.destinationDevice?.name;

                if (sourceDeviceName) {
                    accumOptions.sourceDeviceNames.push(sourceDeviceName);
                }
                if (destinationDeviceName) {
                    accumOptions.destinationDeviceNames.push(
                        destinationDeviceName
                    );
                }

                return accumOptions;
            }, initialOptions);

            sourceDeviceNameOptionsRef.current = options.sourceDeviceNames;
            destinationDeviceNameOptionsRef.current =
                options.destinationDeviceNames;
        }
    }, [
        destinationDeviceNameOptions.length,
        sourceDeviceNameOptions.length,
        triggers,
    ]);

    const [sourceDeviceNameFilter, setSourceDeviceNameFilter] = useState('');
    const [destinationDeviceNameFilter, setDestinationDeviceNameFilter] =
        useState('');

    const filteredTriggers = filterTriggers({
        triggers,
        sourceDeviceNameFilter,
        destinationDeviceNameFilter,
    });

    /**
     *  TODO: Get triggers api 之後會實作 search trigger name 功能，實作後這邊要多傳 triggerName 進去篩選
     * */
    const { isGettingTriggers, getTriggersApi } = useGetTriggersApi({
        page,
        limit,
        sourceDeviceName: sourceDeviceNameFilter,
        destinationDeviceName: destinationDeviceNameFilter,
    });

    useEffect(() => {
        getTriggersApi();
    }, [getTriggersApi]);

    const [selectedIds, setSelectedIds] = useState(Array<number>());

    const isSelectAll = selectedIds.length === filteredTriggers.length;
    const toggleSelectAll = () => {
        if (selectedIds.length === filteredTriggers.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredTriggers.map(({ id }) => id));
        }
    };

    const { isDeletingTriggers, deleteTriggersApi, deleteTriggersResponse } =
        useDeleteTriggersApi(selectedIds);

    const updateSelectedIds = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedIds((previous) => {
            const id = e.target.value;
            const newSelectedIds = [...previous];

            if (e.target.checked) {
                newSelectedIds.push(Number(id));
            } else {
                const index = newSelectedIds.findIndex(
                    (item) => item === Number(id)
                );
                newSelectedIds.splice(index, 1);
            }
            return newSelectedIds;
        });
    };

    const confirmToDeleteTriggers = () => {
        if (
            prompt('請再次輸入 delete，藉此執行刪除') === 'delete' &&
            !isDeletingTriggers
        ) {
            deleteTriggersApi();
        } else {
            alert('輸入錯誤，請再次嘗試');
        }
    };

    const jumpToCreatePage = () => {
        navigate('create');
    };

    useEffect(() => {
        if (
            deleteTriggersResponse &&
            deleteTriggersResponse.status === RESPONSE_STATUS.OK
        ) {
            getTriggersApi();
        }
    }, [deleteTriggersResponse, getTriggersApi]);

    const [
        pageTitleSecondaryButtonClassName,
        setPageTitleSecondaryButtonClassName,
    ] = useState('btn btn-danger disabled');

    useEffect(() => {
        let pageTitleSecondaryButtonClassName = 'btn btn-danger';
        if (selectedIds.length === 0) {
            pageTitleSecondaryButtonClassName += ' disabled';
        }
        setPageTitleSecondaryButtonClassName(pageTitleSecondaryButtonClassName);
    }, [selectedIds]);

    return (
        <div className="triggers" data-testid="triggers">
            <PageTitle
                title="觸發列表"
                primaryButtonVisible={hasTriggersRef.current}
                primaryButtonWording="新增觸發"
                primaryButtonCallback={jumpToCreatePage}
                secondaryButtonIcon={lightTrashIcon}
                secondaryButtonClassName={pageTitleSecondaryButtonClassName}
                secondaryButtonVisible={hasTriggersRef.current}
                secondaryButtonWording="刪除選取"
                secondaryButtonCallback={confirmToDeleteTriggers}
            />
            <div className="card">
                {!hasTriggersRef.current && triggers !== null ? (
                    <EmptyDataToCreateItem itemName="觸發" />
                ) : (
                    <>
                        <div className="d-flex flex-column flex-sm-row">
                            <SearchInput
                                placeholder="搜尋觸發"
                                onChangeValue={(value) => setTriggerName(value)}
                                onSearch={getTriggersApi}
                            />
                            {/* TODO: 來源裝置、目標裝置的 filter，接著要等設計稿改動再調整，應該會改成 autocompeleted input search，現在先不動 */}
                            <label className="ms-3">
                                <select
                                    value={sourceDeviceNameFilter}
                                    onChange={(e) => {
                                        setSourceDeviceNameFilter(
                                            e.target.value
                                        );
                                    }}
                                >
                                    {sourceDeviceNameOptions.map(
                                        (name, index) => {
                                            const value =
                                                name === '來源裝置名稱'
                                                    ? ''
                                                    : name;
                                            return (
                                                <option
                                                    key={`${name}-${index}`}
                                                    value={value}
                                                >
                                                    {name}
                                                </option>
                                            );
                                        }
                                    )}
                                </select>
                            </label>
                            <label className="ms-3">
                                <select
                                    value={destinationDeviceNameFilter}
                                    onChange={(e) => {
                                        setDestinationDeviceNameFilter(
                                            e.target.value
                                        );
                                    }}
                                >
                                    {destinationDeviceNameOptions.map(
                                        (name, index) => {
                                            const value =
                                                name === '目標裝置名稱'
                                                    ? ''
                                                    : name;
                                            return (
                                                <option
                                                    key={`${name}-${index}`}
                                                    value={value}
                                                >
                                                    {name}
                                                </option>
                                            );
                                        }
                                    )}
                                </select>
                            </label>
                        </div>
                        {isGettingTriggers || triggers === null ? (
                            <div>Loading</div>
                        ) : (
                            <div className="mt-3 mt-sm-45">
                                <div className="d-none d-sm-block">
                                    <div className="row py-25 px-3 m-0 bg-black bg-opacity-5 h6 text-black text-opacity-45">
                                        <label className="col-3" role="button">
                                            <div className="d-flex align-items-center">
                                                <input
                                                    type="checkbox"
                                                    className="me-3"
                                                    checked={isSelectAll}
                                                    onChange={toggleSelectAll}
                                                />
                                                <span>觸發名稱</span>
                                            </div>
                                        </label>
                                        <div className="col-2">來源裝置</div>
                                        <div className="col-1">來源 Pin</div>
                                        <div className="col-2">條件</div>
                                        <div className="col-2">目標裝置</div>
                                        <div className="col-1">目標 Pin</div>
                                        <div className="col-1">操作</div>
                                    </div>
                                </div>
                                <div className="triggers-list">
                                    {filteredTriggers.map(
                                        (
                                            {
                                                id,
                                                sourceDevice,
                                                sourcePin,
                                                destinationDevice,
                                                destinationPin,
                                                operator,
                                                sourceThreshold,
                                                name,
                                            },
                                            index
                                        ) => (
                                            <div
                                                key={`${id}-${index}`}
                                                className="row border-bottom border-black border-opacity-10 p-0 m-0 py-sm-4 px-sm-3"
                                            >
                                                <div className="row col-12 col-sm-3 text-black text-opacity-65 h6 mx-0 mb-0 px-0 px-sm-25">
                                                    <div className="d-block d-sm-none col-4 p-3 bg-black bg-opacity-5 text-black text-opacity-45">
                                                        觸發名稱
                                                    </div>
                                                    <label className="col-8 col-sm-12 p-3 p-sm-0 d-flex flex-column flex-sm-row align-items-start">
                                                        <input
                                                            className="me-3 mb-3"
                                                            type="checkbox"
                                                            onChange={
                                                                updateSelectedIds
                                                            }
                                                            value={id}
                                                            checked={selectedIds.includes(
                                                                id
                                                            )}
                                                        />
                                                        {name}
                                                    </label>
                                                </div>
                                                <div className="row col-12 col-sm-2 mx-0 mb-0 px-0 px-sm-25">
                                                    <div className="d-block d-sm-none col-4 p-3 bg-black bg-opacity-5 text-black text-opacity-45">
                                                        來源裝置名稱
                                                    </div>
                                                    <div className="col-8 col-sm-12 p-3 p-sm-0 lh-base">
                                                        {sourceDevice?.name}
                                                    </div>
                                                </div>
                                                <div className="row col-12 col-sm-1 mx-0 mb-0 px-0 px-sm-25">
                                                    <div className="d-block d-sm-none col-4 p-3 bg-black bg-opacity-5 text-black text-opacity-45">
                                                        來源 Pin
                                                    </div>
                                                    <div className="col-8 col-sm-12 p-3 p-sm-0 lh-base">
                                                        {sourcePin}
                                                    </div>
                                                </div>
                                                <div className="row col-12 col-sm-2 mx-0 mb-0 px-0 px-sm-25">
                                                    <div className="d-block d-sm-none col-4 p-3 bg-black bg-opacity-5 text-black text-opacity-45">
                                                        條件
                                                    </div>
                                                    <div className="d-flex col-8 col-sm-12 p-3 p-sm-0 lh-base">
                                                        <span className="pe-1">
                                                            {
                                                                triggerOperators[
                                                                    operator
                                                                ]?.label
                                                            }
                                                        </span>
                                                        <span>
                                                            {sourceThreshold}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="row col-12 col-sm-2 mx-0 mb-0 px-0 px-sm-25">
                                                    <div className="d-block d-sm-none col-4 p-3 bg-black bg-opacity-5 text-black text-opacity-45">
                                                        目標裝置名稱
                                                    </div>
                                                    <div className="col-8 col-sm-12 p-3 p-sm-0 lh-base">
                                                        {
                                                            destinationDevice?.name
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row col-12 col-sm-1 mx-0 mb-0 px-0 px-sm-25">
                                                    <div className="d-block d-sm-none col-4 p-3 bg-black bg-opacity-5 text-black text-opacity-45">
                                                        目標 Pin
                                                    </div>
                                                    <div className="col-8 col-sm-12 p-3 p-sm-0 lh-base">
                                                        {destinationPin}
                                                    </div>
                                                </div>
                                                <div className="row col-12 col-sm-1 mx-0 mb-0 px-0 px-sm-25">
                                                    <div className="d-block d-sm-none col-4 p-3 bg-black bg-opacity-5 text-black text-opacity-45">
                                                        操作
                                                    </div>
                                                    <div className="col-8 col-sm-12 p-3 p-sm-0 d-flex justify-content-start flex-wrap">
                                                        <Link
                                                            className="me-3 mb-3"
                                                            to={`/dashboard/triggers/${id}`}
                                                        >
                                                            <img
                                                                src={pencilIcon}
                                                            />
                                                        </Link>
                                                        <button
                                                            className="btn mb-3 p-0 bg-transparent"
                                                            onClick={() => {
                                                                // TODO: 實作 delete on trigger api
                                                            }}
                                                            disabled={false}
                                                        >
                                                            <img
                                                                src={trashIcon}
                                                            />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                                <div
                                    className={`${
                                        triggers.length > 0
                                            ? 'd-flex'
                                            : 'd-none'
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

export default Triggers;
