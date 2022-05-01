import { useAppSelector } from '@/hooks/redux.hook';
import {
    selectToaster,
    toasterActions,
    ToasterTypeEnum,
} from '@/redux/reducers/toaster.reducer';
import { useEffect, useRef } from 'react';
import { ToasterState } from '@/redux/reducers/toaster.reducer';
import { useDispatch } from 'react-redux';
import iconCloseSrc from '@/assets/images/light-close.svg';

const Toaster = () => {
    const toasters = useAppSelector(selectToaster);
    const previousToastersRef = useRef<ToasterState[]>([]);
    const dispatch = useDispatch();

    useEffect(() => {
        const unSetupToasters = toasters.filter(
            (item) =>
                !previousToastersRef.current
                    .map((prevItem) => prevItem.id)
                    .includes(item.id)
        );

        unSetupToasters.forEach((item) => {
            dispatch(
                toasterActions.changeOneState({
                    id: item.id,
                    isShow: true,
                })
            );
            setTimeout(() => {
                close(item);
            }, item.duration * 1000);
        });

        previousToastersRef.current = toasters;
    }, [toasters]);

    const close = (item: ToasterState) => {
        dispatch(
            toasterActions.changeOneState({
                id: item.id,
                isShow: false,
            })
        );
        setTimeout(() => {
            dispatch(
                toasterActions.clearOne({
                    id: item.id,
                })
            );
        }, 3000);
    };

    return (
        <div className="position-fixed toaster-fixed-section top-0 w-100 d-flex justify-content-center">
            <div className="toaster-container position-absolute">
                {toasters.map((item) => (
                    <div
                        className={`${
                            item.isShow ? 'mt-3' : 'mt-0'
                        } rounded-2 px-3 overflow-hidden toaster position-relative text-white d-flex justify-content-between align-items-center ${
                            item.type === ToasterTypeEnum.INFO
                                ? 'bg-success'
                                : item.type === ToasterTypeEnum.WARN
                                ? 'bg-warn'
                                : item.type === ToasterTypeEnum.ERROR
                                ? 'bg-danger'
                                : ''
                        } ${item.isShow ? 'show' : ''}`}
                        key={item.id}
                    >
                        <div className="py-2">{item.message}</div>
                        <div
                            onClick={() => {
                                close(item);
                            }}
                        >
                            <img src={iconCloseSrc} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Toaster;
