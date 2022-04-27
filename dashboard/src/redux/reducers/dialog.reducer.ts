import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/redux/store';

export type DialogState = {
    type: string;
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

export const dialogSlice = createSlice({
    name: 'dialog',
    initialState: {
        type: '',
        title: '',
        message: '',
        isOpen: false,
        checkedMessage: '',
        buttonClassName: '',
        promptInvalidMessage: '',
        callback: () => {},
    },
    reducers: {
        open: (state, action: PayloadAction<Partial<DialogState>>) => {
            const {
                type,
                title,
                message,
                checkedMessage,
                buttonClassName,
                promptInvalidMessage,
                callback,
            } = action.payload;

            return {
                type: type || '',
                title: title || '',
                message: message || '',
                isOpen: true,
                checkedMessage: checkedMessage || '',
                buttonClassName: buttonClassName || '',
                promptInvalidMessage: promptInvalidMessage || '',
                callback: callback ? callback : () => {},
            };
        },
        close: (state) => {
            state.isOpen = false;
            return state;
        },
    },
});

export const dialogActions = dialogSlice.actions;

export const selectDialog = (state: RootState) => state.dialog;

export default dialogSlice.reducer;
