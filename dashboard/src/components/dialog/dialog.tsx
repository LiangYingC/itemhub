import { useAppSelector } from '@/hooks/redux.hook';
import {
    DialogTypeEnum,
    selectDialog,
    dialogActions,
} from '@/redux/reducers/dialog.reducer';
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

const Dialog = () => {
    const dialog = useAppSelector(selectDialog);
    const dispatch = useDispatch();
    let promptInputValue = '';

    const {
        type,
        title,
        message,
        checkedMessage,
        buttonClassName,
        callback,
        promptInvalidMessage,
        isOpen,
    } = dialog;

    const [isValid, setIsValid] = useState(true);
    const [buttonAvaible, setButtonAvaible] = useState(false);

    const promptInputRef = useRef<HTMLInputElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && type === DialogTypeEnum.PROMPT) {
            promptInputRef.current?.focus();
        } else if (isOpen) {
            cardRef.current?.focus();
        }
        setButtonAvaible(
            type === DialogTypeEnum.CONFIRM || type === DialogTypeEnum.ALERT
        );
    }, [isOpen]);

    const doFunction = () => {
        if (type === DialogTypeEnum.ALERT) {
            alert();
        } else if (type === DialogTypeEnum.CONFIRM) {
            confirm();
        } else if (type === DialogTypeEnum.PROMPT) {
            checkMessage();
        }
    };

    const alert = () => {
        if (callback) {
            callback();
        }
        close();
    };

    const confirm = () => {
        if (callback) {
            callback();
        }
        close();
    };

    const checkMessage = () => {
        if (checkedMessage === promptInputValue && callback) {
            callback();
            setIsValid(true);
            close();
        } else {
            setIsValid(false);
        }
    };

    const close = () => {
        promptInputValue = '';
        if (promptInputRef.current) {
            promptInputRef.current.value = '';
        }
        dispatch(dialogActions.close());
    };

    return (
        <div
            className={`dialog position-fixed top-0 w-100 h-100 d-flex align-items-center justify-content-center p-2 ${
                isOpen ? '' : 'd-none'
            }`}
        >
            <div
                className="card p-4"
                tabIndex={0}
                onKeyUp={(event: React.KeyboardEvent<HTMLDivElement>) => {
                    if (event.key === 'Escape') {
                        close();
                    }
                }}
                ref={cardRef}
            >
                <h4 className={title ? '' : 'd-none'}>{title}</h4>
                <hr />
                <div className={message ? '' : 'd-none'}>{message}</div>
                <div
                    className={`mt-2 ${
                        type === DialogTypeEnum.PROMPT ? '' : 'd-none'
                    }`}
                >
                    <input
                        className="form-control"
                        type="text"
                        ref={promptInputRef}
                        onKeyUp={(
                            event: React.KeyboardEvent<HTMLInputElement>
                        ) => {
                            if (event.key === 'Escape') {
                                close();
                            }
                            promptInputValue = event.currentTarget.value;
                            setButtonAvaible(
                                promptInputValue === checkedMessage
                            );
                            if (event.key === 'Enter') {
                                doFunction();
                            }
                        }}
                        defaultValue={promptInputValue}
                    />
                    <div
                        className={`text-danger text-sm mt-2 invalid-message ${
                            isValid ? 'd-none' : ''
                        }`}
                    >
                        {promptInvalidMessage}
                    </div>
                </div>
                <hr />

                <div className="d-flex align-items-center">
                    <button
                        className={`btn btn-secondary ${
                            [
                                DialogTypeEnum.PROMPT,
                                DialogTypeEnum.CONFIRM,
                            ].includes(type)
                                ? ''
                                : 'd-none'
                        }`}
                        onClick={close}
                    >
                        取消
                    </button>
                    <button
                        className={`btn btn-danger ${buttonClassName}`}
                        disabled={!buttonAvaible}
                        onClick={doFunction}
                    >
                        確認
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dialog;
