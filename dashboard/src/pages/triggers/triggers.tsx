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
import SearchInput from '@/components/Inputs/search-input/search-input';
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

    const [triggerName, setTriggerName] = useState(
        query.get('deviceName') || ''
    );
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

    useEffect(() => {
        if (
            triggers &&
            sourceDeviceNameOptions.length === 0 &&
            destinationDeviceNameOptions.length === 0
        ) {
            const initialOptions = {
                sourceDeviceNames: ['All'],
                destinationDeviceNames: ['All'],
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
        pageTitlePrimaryButtonClassName,
        setPageTitlePrimaryButtonClassName,
    ] = useState('bg-danger text-white border border-danger disabled');

    useEffect(() => {
        let pageTitlePrimaryButtonClassName =
            'bg-danger border border-danger text-white';
        if (selectedIds.length === 0) {
            pageTitlePrimaryButtonClassName += ' disabled';
        }
        setPageTitlePrimaryButtonClassName(pageTitlePrimaryButtonClassName);
    }, [selectedIds]);

    return (
        <div className="triggers" data-testid="triggers">
            <PageTitle
                title="觸發器列表"
                primaryButtonVisible
                primaryButtonWording="刪除選取"
                primaryButtonCallback={confirmToDeleteTriggers}
                primaryButtonIcon={lightTrashIcon}
                primaryButtonClassName={pageTitlePrimaryButtonClassName}
                secondaryButtonVisible
                secondaryButtonWording="新增觸發器"
                secondaryButtonCallback={jumpToCreatePage}
            />
            <div className="bg-white shadow-sm mx-3 mx-sm-0 mx-xl-45 mt-4 mt-sm-0 p-3 p-sm-45 rounded-8">
                <div className="d-flex align-items-center">
                    <SearchInput
                        placeholder="搜尋觸發器"
                        updateValue={(value) => setTriggerName(value)}
                        onSearch={getTriggersApi}
                    />
                    {/* TODO: 來源裝置、目標裝置的 filter，接著要等設計稿改動再調整，應該會改成 autocompeleted input search，現在先不動 */}
                    <label className="ms-3">
                        來源裝置名稱:
                        <select
                            value={sourceDeviceNameFilter}
                            onChange={(e) => {
                                setSourceDeviceNameFilter(e.target.value);
                            }}
                        >
                            {sourceDeviceNameOptions.map((name, index) => {
                                const value = name === 'All' ? '' : name;
                                return (
                                    <option
                                        key={`${name}-${index}`}
                                        value={value}
                                    >
                                        {name}
                                    </option>
                                );
                            })}
                        </select>
                    </label>
                    <label className="ms-3">
                        目標裝置名稱:
                        <select
                            value={destinationDeviceNameFilter}
                            onChange={(e) => {
                                setDestinationDeviceNameFilter(e.target.value);
                            }}
                        >
                            {destinationDeviceNameOptions.map((name, index) => {
                                const value = name === 'All' ? '' : name;
                                return (
                                    <option
                                        key={`${name}-${index}`}
                                        value={value}
                                    >
                                        {name}
                                    </option>
                                );
                            })}
                        </select>
                    </label>
                </div>
                <div className="mt-3 mt-sm-45">
                    <div className="row bg-black bg-opacity-5 text-black text-opacity-45 h6 py-25 mb-0">
                        <label role="button" className="col-2">
                            <div className="d-flex align-items-center">
                                <input
                                    type="checkbox"
                                    className="me-3"
                                    checked={isSelectAll}
                                    onChange={toggleSelectAll}
                                />
                                <span>觸發器名稱</span>
                            </div>
                        </label>
                        <div className="col-2">來源裝置</div>
                        <div className="col-1">來源 Pin</div>
                        <div className="col-2">條件</div>
                        <div className="col-2">目標裝置</div>
                        <div className="col-1">目標 Pin</div>
                        <div className="col-2">操作</div>
                    </div>
                    <div className="triggers" data-testid="triggers">
                        {isGettingTriggers || triggers === null ? (
                            <h1>Loading</h1>
                        ) : filteredTriggers.length === 0 ? (
                            <h1>No Triggers</h1>
                        ) : (
                            filteredTriggers.map(
                                (
                                    {
                                        id,
                                        sourceDevice,
                                        sourcePin,
                                        destinationDevice,
                                        destinationPin,
                                        operator,
                                        sourceThreshold,
                                    },
                                    index
                                ) => (
                                    <div
                                        key={`${id}-${index}`}
                                        className="row py-4 border-1 border-bottom text-black text-opacity-65"
                                    >
                                        <label className="col-2 d-flex align-items-center">
                                            <input
                                                className="me-3"
                                                type="checkbox"
                                                onChange={updateSelectedIds}
                                                value={id}
                                                checked={selectedIds.includes(
                                                    id
                                                )}
                                            />
                                            <span>
                                                {id} TODO: 未來有 Trigger Name
                                                資料時，將 id 改為 name
                                            </span>
                                        </label>
                                        <div className="col-2">
                                            {sourceDevice?.name}
                                        </div>
                                        <div className="col-1">{sourcePin}</div>
                                        <div className="col-2 d-flex">
                                            <span className="pe-1">
                                                {
                                                    triggerOperators[operator]
                                                        .label
                                                }
                                            </span>
                                            <span>{sourceThreshold}</span>
                                        </div>
                                        <div className="col-2">
                                            {destinationDevice?.name}
                                        </div>
                                        <div className="col-1">
                                            {destinationPin}
                                        </div>
                                        <div className="col-2">
                                            <div className="d-flex justify-content-start">
                                                <Link
                                                    className="me-4"
                                                    to={`/dashboard/triggers/${id}`}
                                                >
                                                    <img src={pencilIcon} />
                                                </Link>
                                                <button
                                                    className="btn bg-transparent p-0"
                                                    onClick={() => {
                                                        // TODO: 實作 delete on trigger api
                                                    }}
                                                    disabled={false}
                                                >
                                                    <img src={trashIcon} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            )
                        )}
                    </div>
                    <div className="d-flex justify-content-end w-100 mt-5">
                        <Pagination rowNum={rowNum} page={page} limit={limit} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Triggers;
