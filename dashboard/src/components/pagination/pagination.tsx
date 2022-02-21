import styles from './pagination.module.scss';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Pagination = (props: any | undefined) => {
    const [pages, setPages] = useState<Array<number>>([]);
    const { rowNums, limit, page } = props;

    useEffect(() => {
        const maxPage = Math.ceil(rowNums / limit);
        const _pages = [];
        for (let i = 1; i <= maxPage; i++) {
            _pages.push(i);
        }
        setPages(_pages);
    }, [rowNums, limit]);

    return (
        <div className={styles.pagination} data-testid="pagination">
            {pages.map((pageNumber) =>
                pageNumber === page ? (
                    <span key={pageNumber} className="p-2">
                        {pageNumber}
                    </span>
                ) : (
                    <Link
                        className="p-2"
                        to={`./?page=${pageNumber}`}
                        key={pageNumber}
                    >
                        {pageNumber}
                    </Link>
                )
            )}
        </div>
    );
};

export default Pagination;
