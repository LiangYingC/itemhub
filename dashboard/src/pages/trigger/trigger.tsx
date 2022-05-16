import { useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/hooks/redux.hook';
import {
    useGetTriggerApi,
    useDeleteTriggersApi,
} from '@/hooks/apis/triggers.hook';
import { Link } from 'react-router-dom';
import { RESPONSE_STATUS } from '@/constants/api';
import { dialogActions, DialogTypeEnum } from '@/redux/reducers/dialog.reducer';
import {
    toasterActions,
    ToasterTypeEnum,
} from '@/redux/reducers/toaster.reducer';
import { selectUniversal } from '@/redux/reducers/universal.reducer';
import { selectTriggers } from '@/redux/reducers/triggers.reducer';
import { TriggerItem } from '@/types/triggers.type';
import TriggerForm from './trigger-form/trigger-form';
import PageTitle from '@/components/page-title/page-title';
import Spinner from '@/components/spinner/spinner';
import OnlineStatusTag from '@/components/online-status-tag/online-status-tag';
import trashIcon from '@/assets/images/trash.svg';

const Trigger = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { triggerOperators } = useAppSelector(selectUniversal);

    const { id: idFromUrl } = useParams();
    const triggerId = idFromUrl ? parseInt(idFromUrl) : null;

    const isCreateMode = triggerId === null;
    const isEditMode = location.pathname.includes('edit') && triggerId !== null;

    const createTriggerLocationState = location.state as {
        trigger: TriggerItem;
    } | null;
    const { triggers } = useAppSelector(selectTriggers);
    const trigger =
        triggers?.filter((trigger) => trigger.id === triggerId)[0] ||
        createTriggerLocationState?.trigger ||
        null;
    const triggerName = trigger?.name || '--';

    const { isGettingTrigger, getTriggerApi } = useGetTriggerApi(
        triggerId || 0
    );

    const { isDeletingTriggers, deleteTriggersApi, deleteTriggersResponse } =
        useDeleteTriggersApi([triggerId || 0]);

    const jumpToEditPage = () => {
        navigate(`/dashboard/triggers/edit/${triggerId}`);
    };

    const jumpToListPage = () => {
        navigate('/dashboard/triggers');
    };

    const confirmToDeleteTrigger = () => {
        if (!isDeletingTriggers) {
            dispatch(
                dialogActions.open({
                    message: '刪除後將無法復原, 請輸入 DELETE 完成刪除',
                    title: `確認刪除 "${triggerName}" ?`,
                    type: DialogTypeEnum.PROMPT,
                    checkedMessage: 'DELETE',
                    callback: deleteTriggersApi,
                    promptInvalidMessage: '輸入錯誤，請再次嘗試',
                })
            );
        }
    };

    useEffect(() => {
        if (trigger === null && triggerId) {
            getTriggerApi();
        }
    }, [trigger, triggerId, getTriggerApi]);

    useEffect(() => {
        if (
            triggerId &&
            deleteTriggersResponse &&
            deleteTriggersResponse.status === RESPONSE_STATUS.OK
        ) {
            dispatch(
                toasterActions.pushOne({
                    message: `${triggerName} 已經成功刪除`,
                    duration: 5,
                    type: ToasterTypeEnum.INFO,
                })
            );
            jumpToListPage();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deleteTriggersResponse, dispatch]);

    const isLoading = isGettingTrigger || (trigger === null && !isCreateMode);
    const isReadMode = !isCreateMode && !isEditMode && trigger !== null;

    return (
        <div className="trigger" data-testid="trigger">
            {isLoading ? (
                <div className="w-100 d-flex justify-content-center mt-5">
                    <Spinner />
                </div>
            ) : isReadMode ? (
                <>
                    <PageTitle
                        titleClickCallback={jumpToListPage}
                        titleBackIconVisible
                        title={triggerName}
                        primaryButtonVisible
                        primaryButtonWording="編輯"
                        primaryButtonCallback={jumpToEditPage}
                        secondaryButtonVisible
                        secondaryButtonIcon={trashIcon}
                        secondaryButtonWording="刪除"
                        secondaryButtonCallback={confirmToDeleteTrigger}
                    />
                    <div className="card">
                        <div className="row m-0 border border-white">
                            <div className="col-4 col-md-2 col-lg-2 py-2 bg-black bg-opacity-5 text-black text-opacity-45">
                                事件
                            </div>
                            <div className="col-8 col-md-10 col-lg-4 py-2">
                                <div className="d-flex">
                                    <div className="me-2">
                                        <Link
                                            to={`/dashboard/devices/${trigger.sourceDeviceId}`}
                                        >
                                            {trigger.sourceDevice?.name}
                                        </Link>
                                    </div>
                                    <OnlineStatusTag
                                        isOnline={
                                            trigger.sourceDevice?.online ||
                                            false
                                        }
                                    />
                                </div>
                                <div>Pin: {trigger.sourcePin}</div>
                            </div>
                            <div className="col-4 col-md-2 col-lg-2 py-2 bg-black bg-opacity-5 text-black text-opacity-45">
                                條件
                            </div>
                            <div className="col-8 col-md-10 col-lg-4 py-2">
                                {triggerOperators[trigger.operator]?.label}{' '}
                                {trigger.sourceThreshold}
                            </div>
                        </div>
                        <div className="row m-0 border border-white">
                            <div className="col-4 col-md-2 col-lg-2 py-2 bg-black bg-opacity-5 text-black text-opacity-45">
                                目標
                            </div>
                            <div className="col-8 col-md-10 col-lg-4 py-2">
                                <div className="d-flex">
                                    <div className="me-2">
                                        <Link
                                            to={`/dashboard/devices/${trigger.destinationDeviceId}`}
                                        >
                                            {trigger.destinationDevice?.name}
                                        </Link>
                                    </div>
                                    <OnlineStatusTag
                                        isOnline={
                                            trigger.destinationDevice?.online ||
                                            false
                                        }
                                    />
                                </div>
                                <div>Pin: {trigger.destinationPin}</div>
                            </div>
                            <div className="col-4 col-md-2 col-lg-2 py-2 bg-black bg-opacity-5 text-black text-opacity-45">
                                目標狀態
                            </div>
                            <div className="col-8 col-md-10 col-lg-4 py-2">
                                {trigger.destinationDeviceTargetState === 1
                                    ? '開'
                                    : '關'}
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <TriggerForm trigger={trigger} isCreateMode={isCreateMode} />
            )}
        </div>
    );
};

export default Trigger;
