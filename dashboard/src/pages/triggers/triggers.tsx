import styles from './triggers.module.scss';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@/hooks/query.hook';
import { useAppSelector } from '@/hooks/redux.hook';
import { useGetTriggersApi } from '@/hooks/apis/triggers.hook';
import { selectTriggers } from '@/redux/reducers/triggers.reducer';
import Pagination from '@/components/pagination/pagination';

const Triggers = () => {
    const query = useQuery();
    const limit = Number(query.get('limit') || 5);
    const page = Number(query.get('page') || 1);

    const { triggers, rowNums } = useAppSelector(selectTriggers);

    const { isGettingTriggers, getTriggersApi } = useGetTriggersApi({
        page,
        limit,
    });

    useEffect(() => {
        getTriggersApi();
    }, [page]);

    return (
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
                        <label key={id} className="mt-3 mb-3">
                            <div>Id: {id}</div>
                            <div>OwnerId: {ownerId}</div>
                            <div>Source Device Name: {sourceDevice.name}</div>
                            <div>Source Device Pin: {sourcePin}</div>
                            <div>
                                Destination Device Name:{' '}
                                {destinationDevice.name}
                            </div>
                            <div>Destination Device Pin: {destinationPin}</div>
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
    );
};

export default Triggers;
