import { useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/hooks/redux.hook';
import {
    useGetTriggerApi,
    useDeleteTriggersApi,
} from '@/hooks/apis/triggers.hook';
import { RESPONSE_STATUS } from '@/constants/api';
import { dialogActions, DialogTypeEnum } from '@/redux/reducers/dialog.reducer';
import {
    toasterActions,
    ToasterTypeEnum,
} from '@/redux/reducers/toaster.reducer';
import { selectTriggers } from '@/redux/reducers/triggers.reducer';
import { TriggerItem } from '@/types/triggers.type';
import TriggerForm from './trigger-form/trigger-form';
import PageTitle from '@/components/page-title/page-title';
import Spinner from '@/components/spinner/spinner';
import trashIcon from '@/assets/images/trash.svg';

const Trigger = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

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

    return (
        <div className="trigger" data-testid="trigger">
            {isGettingTrigger || (trigger === null && !isCreateMode) ? (
                <div className="w-100 d-flex justify-content-center mt-5">
                    <Spinner />
                </div>
            ) : isCreateMode || isEditMode ? (
                <TriggerForm trigger={trigger} isCreateMode={isCreateMode} />
            ) : (
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
            )}
        </div>
    );
};

export default Trigger;
