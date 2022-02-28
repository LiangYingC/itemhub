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
        <div className={styles.Triggers} data-testid="Triggers">
            {isGettingTriggers || triggers === null ? (
                <div>Loading</div>
            ) : (
                triggers.map(({ id, ownerId }) => (
                    <label className="d-flex align-items-top" key={id}>
                        <div>
                            <div>
                                <span>Id</span>
                                <span>OwnerId</span>
                            </div>
                            <Link to={`/dashboard/trigger/${id}`}>
                                <span>{id}</span>
                                <span>{ownerId}</span>
                            </Link>
                        </div>
                    </label>
                ))
            )}
            <div>Page: {page}</div>
            <Pagination page={page} rowNums={rowNums} limit={limit} />
        </div>
    );
};

export default Triggers;
