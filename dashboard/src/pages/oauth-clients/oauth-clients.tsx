import { useEffect, useState } from 'react';
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

const OauthClients = () => {
    const query = useQuery();
    const limit = Number(query.get('limit') || 5);
    const page = Number(query.get('page') || 1);

    const { oauthClients, rowNum } = useAppSelector(selectOauthClients);

    const [selectedIds, setSelectedIds] = useState(Array<number>());
    const [shouldBeDeleteId, setShouldBeDeleteId] = useState(0);
    const [refreshFlag, setRefreshFlag] = useState(false);
    const [
        pageTitlePrimaryButtonClassName,
        setPageTitlePrimaryButtonClassName,
    ] = useState('bg-danger text-white disabled');

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
            let pageTitlePrimaryButtonClassName = 'bg-danger text-white';
            if (newSelectedIds.length === 0) {
                pageTitlePrimaryButtonClassName += ' disabled';
            }
            setPageTitlePrimaryButtonClassName(pageTitlePrimaryButtonClassName);

            return newSelectedIds;
        });
    };

    const jumpToCreatePage = () => {
        navigate('create');
    };

    const checkAllOrNot = () => {
        console.log('checkAllOrNot');
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
                title="oAuth Client 列表"
                primaryButtonVisible
                primaryButtonWording="刪除選取"
                primaryButtonCallback={deleteMultiple}
                primaryButtonIcon={lightTrashIcon}
                primaryButtonClassName={pageTitlePrimaryButtonClassName}
                secondaryButtonVisible
                secondaryButtonWording="新增 oAuthClient"
                secondaryButtonCallback={jumpToCreatePage}
            />
            <div className="card mx-4 p-45">
                {isLoading || oauthClients === null ? (
                    <div>Loading</div>
                ) : (
                    <>
                        <div className="row bg-black bg-opacity-5 text-black text-opacity-45 h6 py-25 mb-0">
                            <div
                                role="button"
                                className="col-10"
                                onClick={checkAllOrNot}
                            >
                                <div className="d-flex align-items-center">
                                    <input type="checkbox" className="me-3" />
                                    oAuthClient Id
                                </div>
                            </div>
                            <div className="col-2">操作</div>
                        </div>
                        {oauthClients.map(({ id, clientId }) => (
                            <div
                                key={id}
                                className="row py-4 border-1 border-bottom text-black text-opacity-65"
                            >
                                <label className="col-10">
                                    <input
                                        type="checkbox"
                                        onChange={check}
                                        value={id}
                                        className="me-3"
                                    />
                                    {clientId}
                                </label>
                                <div className="col-2">
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
                    </>
                )}
                <div className="d-flex justify-content-end w-100 mt-5">
                    <Pagination rowNum={rowNum} page={page} limit={limit} />
                </div>
            </div>
        </div>
    );
};

export default OauthClients;
