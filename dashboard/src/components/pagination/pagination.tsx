import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import paginationPrev from '@/assets/images/pagination-prev.svg';
import paginationNext from '@/assets/images/pagination-next.svg';
import paginationDot from '@/assets/images/pagination-dot.svg';

const Pagination = (props: { rowNum: number; limit: number; page: number }) => {
    const [pages, setPages] = useState<Array<number>>([]);
    const { rowNum, limit, page } = props;
    const [isShowPrevDot, setIsShowPrevDot] = useState<boolean>(false);
    const [isShowNextDot, setIsShowNextDot] = useState<boolean>(false);
    const [maxPage, setMaxPage] = useState<number>();

    useEffect(() => {
        const maxPage = Math.ceil(rowNum / limit);
        setMaxPage(maxPage);

        if (page - 2 > 1) {
            setIsShowPrevDot(true);
        }
        if (page + 2 < maxPage) {
            setIsShowNextDot(true);
        }

        const pages = [];
        for (let i = 1; i <= maxPage; i++) {
            if (i + 1 == page || i + 2 == page) {
                pages.push(i);
            }
            if (i == page) {
                pages.push(i);
            }
            if (i - 1 == page || i - 2 == page) {
                pages.push(i);
            }
        }
        setPages(pages);
    }, [rowNum, limit]);

    return (
        <div
            className="pagination d-flex align-items-center"
            data-testid="pagination"
        >
            <Link
                className={`${page === 1 ? 'd-none' : 'item'} `}
                to={`./?page=${page - 1}`}
            >
                <img src={paginationPrev} alt="" />
            </Link>
            <Link
                className={`${isShowPrevDot ? 'item' : 'd-none'} `}
                to={`./?page=1`}
            >
                1
            </Link>
            <span className={`${isShowPrevDot ? 'item' : 'd-none'} `}>
                <img src={paginationDot} alt="" />
            </span>
            {pages.map((pageNumber) =>
                pageNumber === page ? (
                    <span
                        key={pageNumber}
                        className="bg-primary text-white item"
                    >
                        {pageNumber}
                    </span>
                ) : (
                    <Link
                        className="item"
                        to={`./?page=${pageNumber}`}
                        key={pageNumber}
                    >
                        {pageNumber}
                    </Link>
                )
            )}
            <span className={`${isShowNextDot ? 'item' : 'd-none'} `}>
                <img src={paginationDot} alt="" />
            </span>
            <Link
                className={`${isShowNextDot ? 'item' : 'd-none'} `}
                to={`./?page=${maxPage}`}
            >
                {maxPage}
            </Link>
            <Link
                className={`${page === maxPage ? 'd-none' : 'item'}`}
                to={`./?page=${page + 1}`}
            >
                <img src={paginationNext} alt="" />
            </Link>
        </div>
    );
};

export default Pagination;
