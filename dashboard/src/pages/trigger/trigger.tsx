import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/hooks/redux.hook';
import { useGetTriggerApi } from '@/hooks/apis/triggers.hook';
import { selectTriggers } from '@/redux/reducers/triggers.reducer';
import { TriggerItem } from '@/types/triggers.type';
import TriggerForm from './trigger-form/trigger-form';
import PageTitle from '@/components/page-title/page-title';

const Trigger = () => {
    const location = useLocation();

    const { id: idFromUrl } = useParams();
    const id = idFromUrl ? parseInt(idFromUrl) : null;

    const isCreateMode = id === null;
    const isEditMode = location.pathname.includes('edit') && id !== null;

    const createTriggerLocationState = location.state as {
        trigger: TriggerItem;
    } | null;
    const { triggers } = useAppSelector(selectTriggers);
    const trigger =
        triggers?.filter((trigger) => trigger.id === id)[0] ||
        createTriggerLocationState?.trigger ||
        null;

    const { isGettingTrigger, getTriggerApi } = useGetTriggerApi(id || 0);
    useEffect(() => {
        if (trigger === null) {
            getTriggerApi();
        }
    }, [trigger, getTriggerApi]);

    return (
        <div className="trigger" data-testid="trigger">
            {isGettingTrigger ? (
                <div>Loading</div>
            ) : isCreateMode || isEditMode ? (
                <TriggerForm trigger={trigger} isCreateMode={isCreateMode} />
            ) : (
                // TODO: implement read mode
                <PageTitle title={trigger?.name || '尚無觸發名稱'} />
            )}
        </div>
    );
};

export default Trigger;
