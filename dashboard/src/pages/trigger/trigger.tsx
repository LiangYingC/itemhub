import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppSelector } from '@/hooks/redux.hook';
import { useGetTriggerApi } from '@/hooks/apis/triggers.hook';
import { selectTriggers } from '@/redux/reducers/triggers.reducer';
import PageTitle from '@/components/page-title/page-title';

const Trigger = () => {
    const { id } = useParams();
    const numId = Number(id);
    const { triggers } = useAppSelector(selectTriggers);
    const trigger =
        triggers?.filter((trigger) => trigger.id === numId)[0] || null;

    const { isGettingTrigger, getTriggerApi } = useGetTriggerApi(numId);
    useEffect(() => {
        if (trigger === null) {
            getTriggerApi();
        }
    }, []);

    return (
        <div className="trigger" data-testid="trigger">
            <PageTitle title={`觸發 - `} /> {/* Todo: Trigger 加上 Name Field*/}
            {isGettingTrigger || trigger === null ? (
                <div>Loading</div>
            ) : (
                <>
                    <div>Id: {trigger.id}</div>
                    <div>OwnerId: {trigger.ownerId}</div>
                    <div>
                        Source Device Name:{' '}
                        {trigger.sourceDevice?.name || 'No Data'}
                    </div>
                    <div>Source Device Pin: {trigger.sourcePin}</div>
                    <div>
                        Destination Device Name:{' '}
                        {trigger.destinationDevice?.name || 'No Data'}
                    </div>
                    <div>Destination Device Pin: {trigger.destinationPin}</div>
                    <Link to="../triggers">Back to triggers</Link>
                </>
            )}
        </div>
    );
};

export default Trigger;
