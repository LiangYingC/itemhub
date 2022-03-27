import styles from './triggers.module.scss';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RESPONSE_STATUS } from '@/constants/api';
import { useQuery } from '@/hooks/query.hook';
import { useAppSelector } from '@/hooks/redux.hook';
import {
    useGetTriggersApi,
    useDeleteTriggersApi,
} from '@/hooks/apis/triggers.hook';
import { selectTriggers } from '@/redux/reducers/triggers.reducer';
import Pagination from '@/components/pagination/pagination';

const Triggers = () => {
    const query = useQuery();
    const limit = Number(query.get('limit') || 5);
    const page = Number(query.get('page') || 1);

    const { triggers, rowNum } = useAppSelector(selectTriggers);

    const [selectedIds, setSelectedIds] = useState(Array<number>());

    const { isGettingTriggers, getTriggersApi } = useGetTriggersApi({
        page,
        limit,
    });

    const { isDeletingTriggers, deleteTriggersApi, deleteTriggersResponse } =
        useDeleteTriggersApi(selectedIds);

    useEffect(() => {
        getTriggersApi();
    }, [page]);

    useEffect(() => {
        if (
            deleteTriggersResponse &&
            deleteTriggersResponse.status === RESPONSE_STATUS.OK
        ) {
            getTriggersApi();
        }
    }, [deleteTriggersResponse]);

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
        }
    };

    return (
        <>
            <button
                onClick={confirmToDeleteTriggers}
                disabled={isDeletingTriggers || selectedIds.length <= 0}
            >
                {isDeletingTriggers
                    ? 'Deleting Triggers'
                    : 'Delete Selected Trigger'}
            </button>
            <div className={styles.triggers} data-testid="triggers">
                {isGettingTriggers || triggers === null ? (
                    <div>Loading</div>
                ) : (
                    triggers.map(
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
