import {
    ReactNode,
    createContext,
    useState,
    useCallback,
    useContext,
} from 'react';

export type DialogState = {
    type: DialogTypeEnum;
    title: string;
    message: string;
    isOpen: boolean;
    checkedMessage: string;
    buttonClassName: string;
    promptInvalidMessage: string;
    callback: () => void;
};

export enum DialogTypeEnum {
    PROMPT = 'prompt',
    ALERT = 'alert',
    CONFIRM = 'confirm',
}

export interface DialogContext {
    dialogState: DialogState;
    openDialog: (newDialogData: Partial<DialogState>) => void;
    closeDialog: () => void;
}

export const initialDialogContext: DialogContext = {
    dialogState: {
        type: DialogTypeEnum.ALERT,
        title: '',
        message: '',
        isOpen: false,
        checkedMessage: '',
        buttonClassName: '',
        promptInvalidMessage: '',
        callback: () => {},
    },
    openDialog: () => null,
    closeDialog: () => null,
};

const DialogContext = createContext(initialDialogContext);

export const useDialog = () => {
    const context = useContext(DialogContext);
    return context;
};

export const DialogProvider = ({ children }: { children: ReactNode }) => {
    const [dialogState, setDialogState] = useState({
        ...initialDialogContext.dialogState,
    });

    const openDialog = useCallback((newDialogData) => {
        setDialogState((prev) => {
            return {
                ...prev,
                isOpen: true,
                ...newDialogData,
            };
        });
    }, []);

    const closeDialog = useCallback(() => {
        setDialogState({ ...initialDialogContext.dialogState });
    }, []);

    const context = {
        dialogState,
        openDialog,
        closeDialog,
    };

    return (
        <DialogContext.Provider value={context}>
            {children}
        </DialogContext.Provider>
    );
};
