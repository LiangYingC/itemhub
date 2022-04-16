import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Pagination = (props: { rowNum: number; limit: number; page: number }) => {
    const [pages, setPages] = useState<Array<number>>([]);
    const { rowNum, limit, page } = props;

    useEffect(() => {
        const maxPage = Math.ceil(rowNum / limit);
        const pages = [];
        for (let i = 1; i <= maxPage; i++) {
            pages.push(i);
        }
        setPages(pages);
    }, [rowNum, limit]);

    return (
        <div
            className="pagination d-flex align-items-center"
            data-testid="pagination"
        >
            <Link
                className={`${
                    page === 1 ? 'd-none' : ''
                } p-3 text-primary-600 text-decoration-none`}
                to={`./?page=${page - 1}`}
            >
                上一頁
            </Link>
            {pages.map((pageNumber) =>
                pageNumber === page ? (
                    <span
                        key={pageNumber}
                        className="p-3 text-primary-900 text-decoration-none"
                    >
                        {pageNumber}
                    </span>
                ) : (
                    <Link
                        className="p-3 text-primary-600 text-decoration-none"
                        to={`./?page=${pageNumber}`}
                        key={pageNumber}
                    >
                        {pageNumber}
                    </Link>
                )
            )}
            <Link
                className={`${
                    page === pages.length ? 'd-none' : ''
                } p-3 text-primary-600 text-decoration-none`}
                to={`./?page=${page + 1}`}
            >
                下一頁
            </Link>
        </div>
    );
};

export default Pagination;
