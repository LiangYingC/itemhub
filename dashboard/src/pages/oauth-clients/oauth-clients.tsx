import { useEffect, useState, useRef } from 'react';
import { useQuery } from '@/hooks/query.hook';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/redux.hook';
import {
    useDeleteOauthClients,
    useGetOauthClients,
} from '@/hooks/apis/oauth-clients.hook';
import { selectOauthClients } from '@/redux/reducers/oauth-clients.reducer';
import Pagination from '@/components/pagination/pagination';
import { RESPONSE_STATUS } from '@/constants/api';
import PageTitle from '@/components/page-title/page-title';
import pencilIcon from '@/assets/images/pencil.svg';
import lightTrashIcon from '@/assets/images/light-trash.svg';
import trashIcon from '@/assets/images/trash.svg';
import plusIcon from '@/assets/images/icon-plus.svg';
import emptyImage from '@/assets/images/empty-image.svg';

const OauthClients = () => {
    const query = useQuery();
    const limit = Number(query.get('limit') || 20);
    const page = Number(query.get('page') || 1);

    const { oauthClients, rowNum } = useAppSelector(selectOauthClients);

    const [selectedIds, setSelectedIds] = useState(Array<number>());
    const [shouldBeDeleteId, setShouldBeDeleteId] = useState(0);
    const [refreshFlag, setRefreshFlag] = useState(false);
    const [isSelectAll, setIsSelectAll] = useState(false);
    const hasOauthClientsRef = useRef(false);
    const [
        pageTitleSecondaryButtonClassName,
        setPageTitlePrimaryButtonClassName,
    ] = useState('btn btn-danger disabled');

    const { isLoading, fetchApi } = useGetOauthClients({
        page,
        limit,
    });

    const {
        isLoading: isDeleting,
        fetchApi: deleteMultipleApi,
        data: responseOfDelete,
    } = useDeleteOauthClients(selectedIds);

    const {
        isLoading: isDeletingOne,
        fetchApi: deleteApi,
        data: responseOfDeleteOne,
    } = useDeleteOauthClients([shouldBeDeleteId]);

    const navigate = useNavigate();

    useEffect(() => {
        if (oauthClients && oauthClients.length > 0) {
            hasOauthClientsRef.current = true;
        }
    }, [oauthClients]);

    useEffect(() => {
        fetchApi();
    }, [page, refreshFlag]);

    useEffect(() => {
        if (responseOfDelete?.status === RESPONSE_STATUS.OK) {
            setRefreshFlag(!refreshFlag);
            setSelectedIds([]);
        }
    }, [responseOfDelete]);

    useEffect(() => {
        if (responseOfDeleteOne?.status === RESPONSE_STATUS.OK) {
            setRefreshFlag(!refreshFlag);
            setShouldBeDeleteId(0);
        }
    }, [responseOfDeleteOne]);

    useEffect(() => {
        if (shouldBeDeleteId) {
            deleteApi();
        }
    }, [shouldBeDeleteId]);

    useEffect(() => {
        if (selectedIds.length === oauthClients?.length) {
            setIsSelectAll(true);
        } else {
            setIsSelectAll(false);
        }
    }, [selectedIds, oauthClients]);

    const check = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedIds((previous) => {
            const newSelectedIds = [...previous];
            if (event.target.checked) {
                newSelectedIds.push(Number(event.target.value));
            } else {
                const index = newSelectedIds.findIndex(
                    (item) => item === Number(event.target.value)
                );
                newSelectedIds.splice(index, 1);
            }
            let pageTitleSecondaryButtonClassName = 'btn btn-danger';
            if (newSelectedIds.length === 0) {
                pageTitleSecondaryButtonClassName += ' disabled';
            }
            setPageTitlePrimaryButtonClassName(
                pageTitleSecondaryButtonClassName
            );
            return newSelectedIds;
        });
    };

    const jumpToCreatePage = () => {
        navigate('create');
    };

    const checkAllOrNot = () => {
        if (selectedIds.length === oauthClients?.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds((oauthClients || []).map((item) => item.id));
        }
    };

    const deleteOne = (id: number) => {
        if (prompt('請輸入 delete') !== 'delete') {
            return;
        }
        setShouldBeDeleteId(() => {
            return id;
        });
    };

    const deleteMultiple = () => {
        if (prompt('請輸入 delete') !== 'delete') {
            return;
        }
        deleteMultipleApi();
    };

    return (
        <div className="oauth-clients" data-testid="oauth-clients">
            <PageTitle
                title="oAuthClient 列表"
                primaryButtonVisible
                primaryButtonWording="新增 oAuthClient"
                primaryButtonCallback={jumpToCreatePage}
                secondaryButtonIcon={lightTrashIcon}
                secondaryButtonClassName={pageTitleSecondaryButtonClassName}
                secondaryButtonVisible
                secondaryButtonWording="刪除選取"
                secondaryButtonCallback={deleteMultiple}
            />
            <div className="card">
                {isLoading || oauthClients === null ? (
                    <div>Loading</div>
                ) : (
                    <>
                        <div
                            className={`${
                                hasOauthClientsRef.current
                                    ? 'd-none'
                                    : 'd-block'
                            } p-6 text-center`}
                        >
                            <img src={emptyImage} alt="" />
                            <div className="mt-2">
                                尚未建立任何 oAuthClient，點擊按鈕開始新增吧！
                            </div>
                            <button
                                onClick={jumpToCreatePage}
                                className="btn btn-primary mx-auto mt-3 "
                            >
                                <img className="icon pe-2" src={plusIcon} />
                                <div className="">新增 oAuthClient</div>
                            </button>
                        </div>
                        <div
                            className={`${
                                hasOauthClientsRef.current
                                    ? 'd-block'
                                    : 'd-none'
                            }`}
                        >
                            <div className="row bg-black bg-opacity-5 text-black text-opacity-45 h6 py-25 mb-0">
                                <label
                                    role="button"
                                    className="col-8 col-sm-10"
                                >
                                    <div className="d-flex align-items-center">
                                        <input
                                            type="checkbox"
                                            className="me-3"
                                            onChange={checkAllOrNot}
                                            checked={isSelectAll}
                                        />
                                        oAuthClient Id
                                    </div>
                                </label>
                                <div className="col-4 col-sm-2">操作</div>
                            </div>

                            {oauthClients.map(({ id, clientId }) => (
                                <div
                                    key={id}
                                    className="row py-4 border-1 border-bottom text-black text-opacity-65"
                                >
                                    <label className="col-8 col-sm-10">
                                        <input
                                            type="checkbox"
                                            onChange={check}
                                            value={id}
                                            className="me-3"
                                            checked={selectedIds.includes(id)}
                                        />
                                        {clientId}
                                    </label>
                                    <div className="col-4 col-sm-2">
                                        <div className="d-flex justify-content-start">
                                            <Link
                                                to={`/dashboard/oauth-clients/${id}`}
                                                className="me-4"
                                            >
                                                <img src={pencilIcon} />
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    deleteOne(id);
                                                }}
                                                disabled={isDeletingOne}
                                                className="btn bg-transparent p-0"
                                            >
                                                <img src={trashIcon} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="d-flex justify-content-end w-100 mt-5">
                            <Pagination
                                rowNum={rowNum}
                                page={page}
                                limit={limit}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default OauthClients;
