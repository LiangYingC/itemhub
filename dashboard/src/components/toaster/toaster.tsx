import { useAppSelector } from '@/hooks/redux.hook';
import {
    selectToaster,
    toasterActions,
    ToasterStatus,
    ToasterType,
} from '@/redux/reducers/toaster.reducer';
import { useEffect, useRef, useState } from 'react';
import { ToasterState } from '@/redux/reducers/toaster.reducer';
import { useDispatch } from 'react-redux';
import iconCloseSrc from '@/assets/images/light-close.svg';

const Toaster = () => {
    const toasters = useAppSelector(selectToaster).toasters;
    const init: ToasterState[] = [];
    const previousToastersRef = useRef(init);
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
                toasterActions.changeState({
                    id: item.id,
                    status: ToasterStatus.VISIBLE,
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
            toasterActions.changeState({
                id: item.id,
                status: ToasterStatus.INVISIBLE,
            })
        );
        setTimeout(() => {
            dispatch(
                toasterActions.clear({
                    id: item.id,
                })
            );
        }, 3000);
    };

    return (
        // UI 結構等設計稿後再重構調整
        <div className="position-fixed top-0 w-100 d-flex justify-content-center">
            <div className="toaster-container position-absolute">
                {toasters.map((item) => (
                    <div
                        className={`${
                            item.status === ToasterStatus.VISIBLE ? 'mt-3' : ''
                        } rounded-2 px-3 overflow-hidden toaster position-relative text-white d-flex justify-content-between align-items-center ${
                            item.type === ToasterType.INFO
                                ? 'bg-success'
                                : item.type === ToasterType.WARN
                                ? 'bg-warn'
                                : item.type === ToasterType.ERROR
                                ? 'bg-danger'
                                : ''
                        } ${
                            item.status === ToasterStatus.VISIBLE
                                ? 'visible'
                                : ''
                        }`}
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
