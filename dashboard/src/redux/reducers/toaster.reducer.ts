import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/redux/store';

export type ToasterState = {
    message: string;
    duration: number;
    type: string;
    id: number;
    status: string;
};

export const ToasterType = {
    INFO: 'info',
    ERROR: 'error',
    WARN: 'warn',
};

export const ToasterStatus = {
    VISIBLE: 'visible',
    INVISIBLE: 'invisible',
};

const initialState: ToasterState[] = [];

export const toasterSlice = createSlice({
    name: 'toaster',
    initialState,
    reducers: {
        push: (state, action: PayloadAction<Partial<ToasterState>>) => {
            const { message, duration, type } = action.payload;
            const newToasterItem: ToasterState = {
                message: message || '',
                duration: duration || 0,
                type: type || '',
                id: new Date().getTime(),
                status: ToasterStatus.INVISIBLE,
            };
            return [newToasterItem, ...state];
        },
        changeState: (
            state,
            action: PayloadAction<{ id: number; status: string }>
        ) => {
            const targetToaster = state.find(
                (item) => item.id === action.payload.id
            );
            if (!targetToaster) {
                throw new Error('Can not change state when devices is null.');
            }
            targetToaster.status = action.payload.status;
            return state;
        },
        clear: (state, action: PayloadAction<{ id: number }>) => {
            return [...state.filter((item) => item.id !== action.payload.id)];
        },
        clearAll: () => {
            return [];
        },
    },
});

export const toasterActions = toasterSlice.actions;

export const selectToaster = (state: RootState) => state;

export default toasterSlice.reducer;
