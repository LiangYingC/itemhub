import styles from './triggers.module.scss';
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
import { ArrayHelpers } from '@/helpers/array.helper';
import { TriggerItem } from '@/types/triggers.type';
import Pagination from '@/components/pagination/pagination';

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
    const { isDeletingTriggers, deleteTriggersApi, deleteTriggersResponse } =
        useDeleteTriggersApi(selectedIds);

    const updateSelectedIds = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedIds((previous) => {
            const id = event.target.value;
            const newSelectedIds = [...previous];

            if (event.target.checked) {
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
        if (prompt('請再次輸入 delete，藉此執行刪除') === 'delete') {
            deleteTriggersApi();
        } else {
            alert('輸入錯誤，請再次嘗試');
        }
    };

    useEffect(() => {
        if (
            deleteTriggersResponse &&
            deleteTriggersResponse.status === RESPONSE_STATUS.OK
        ) {
            getTriggersApi();
        }
    }, [deleteTriggersResponse, getTriggersApi]);

    return (
        <>
            <div>
                <label>
                    SourceDeviceName:
                    <select
                        value={sourceDeviceNameFilter}
                        onChange={(e) => {
                            setSourceDeviceNameFilter(e.target.value);
                        }}
                    >
                        {sourceDeviceNameOptions.map((name, index) => {
                            const value = name === 'All' ? '' : name;
                            return (
                                <option key={`${name}-${index}`} value={value}>
                                    {name}
                                </option>
                            );
                        })}
                    </select>
                </label>
                <label>
                    DestinationDeviceName:
                    <select
                        value={destinationDeviceNameFilter}
                        onChange={(e) => {
                            setDestinationDeviceNameFilter(e.target.value);
                        }}
                    >
                        {destinationDeviceNameOptions.map((name, index) => {
                            const value = name === 'All' ? '' : name;
                            return (
                                <option key={`${name}-${index}`} value={value}>
                                    {name}
                                </option>
                            );
                        })}
                    </select>
                </label>
            </div>
            <button
                onClick={confirmToDeleteTriggers}
                disabled={isDeletingTriggers || selectedIds.length <= 0}
            >
                {isDeletingTriggers
                    ? 'Deleting Triggers'
                    : 'Delete Selected Trigger'}
            </button>
            <button
                onClick={() =>
                    navigate('../triggers/create', { replace: false })
                }
            >
                Create Trigger
            </button>
            <div className={styles.triggers} data-testid="triggers">
                {isGettingTriggers || triggers === null ? (
                    <h1>Loading</h1>
                ) : filteredTriggers.length === 0 ? (
                    <h1>No Triggers</h1>
                ) : (
                    filteredTriggers.map(
                        ({
                            id,
                            ownerId,
                            sourceDevice,
                            sourcePin,
                            destinationDevice,
                            destinationPin,
                        }) => (
                            <label key={id} className="mt-2 mb-2">
                                <input
                                    type="checkbox"
                                    onChange={updateSelectedIds}
                                    value={id}
                                />
                                <div>Id: {id}</div>
                                <div>OwnerId: {ownerId}</div>
                                <div>
                                    Source Device Name:{' '}
                                    {sourceDevice?.name || 'No Data'}
                                </div>
                                <div>Source Device Pin: {sourcePin}</div>
                                <div>
                                    Destination Device Name:{' '}
                                    {destinationDevice?.name || 'No Data'}
                                </div>
                                <div>
                                    Destination Device Pin: {destinationPin}
                                </div>
                                <Link to={`../triggers/${id}`}>
                                    Go to id:{id} trigger
                                </Link>
                            </label>
                        )
                    )
                )}
                <div>Page: {page}</div>
                <Pagination page={page} rowNum={rowNum} limit={limit} />
            </div>
        </>
    );
};

export default Triggers;
