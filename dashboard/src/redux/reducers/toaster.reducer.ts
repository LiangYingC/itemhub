import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/redux/store';

export type ToasterState = {
    message: string;
    duration: number;
    type: string;
    id: number;
    isShow: boolean;
};

export enum ToasterTypeEnum {
    INFO = 'info',
    ERROR = 'error',
    WARN = 'warn',
}

const initialState: ToasterState[] = [];

export const toasterSlice = createSlice({
    name: 'toaster',
    initialState,
    reducers: {
        pushOne: (state, action: PayloadAction<Partial<ToasterState>>) => {
            const { message, duration, type } = action.payload;
            const newToasterItem: ToasterState = {
                message: message || '',
                duration: duration || 0,
                type: type || '',
                id: new Date().getTime(),
                isShow: false,
            };
            return [newToasterItem, ...state];
        },
        changeOneState: (
            state,
            action: PayloadAction<{ id: number; isShow: boolean }>
        ) => {
            const targetToaster = state.find(
                (item) => item.id === action.payload.id
            );
            if (!targetToaster) {
                throw new Error(
                    "Can not change state cause can't find toaster target.."
                );
            }
            targetToaster.isShow = action.payload.isShow;
            return state;
        },
        clearOne: (state, action: PayloadAction<{ id: number }>) => {
            return [...state.filter((item) => item.id !== action.payload.id)];
        },
        clearAll: () => {
            return [];
        },
    },
});

export const toasterActions = toasterSlice.actions;

export const selectToaster = (state: RootState) => state.toasters;

export default toasterSlice.reducer;
