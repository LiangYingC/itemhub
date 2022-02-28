import styles from './triggers.module.scss';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

    const { triggers, rowNums } = useAppSelector(selectTriggers);

    const [selectedIds, setSelectedIds] = useState(Array<number>());

    const { isGettingTriggers, getTriggersApi } = useGetTriggersApi({
        page,
        limit,
    });

    const { isDeletingTriggers, deletingTriggersApi } =
        useDeleteTriggersApi(selectedIds);

    useEffect(() => {
        getTriggersApi();
    }, [page]);

    const checkSelectedIds = (event: React.ChangeEvent<HTMLInputElement>) => {
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

    return (
        <>
            <button
                onClick={deletingTriggersApi}
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
                                    onChange={checkSelectedIds}
                                    value={id}
                                />
                                <div>Id: {id}</div>
                                <div>OwnerId: {ownerId}</div>
                                <div>
                                    Source Device Name: {sourceDevice.name}
                                </div>
                                <div>Source Device Pin: {sourcePin}</div>
                                <div>
                                    Destination Device Name:{' '}
                                    {destinationDevice.name}
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
                <Pagination page={page} rowNums={rowNums} limit={limit} />
            </div>
        </>
    );
};

export default Triggers;
