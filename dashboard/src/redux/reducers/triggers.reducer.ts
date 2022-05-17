import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/redux/store';
import { TriggerItem } from '@/types/triggers.type';

type TriggersState = {
    triggers: TriggerItem[] | null;
    rowNum: number;
};

const initialState: TriggersState = {
    triggers: null,
    rowNum: 0,
};

export const triggersSlice = createSlice({
    name: 'triggers',
    initialState,
    reducers: {
        refreshTriggers: (state, action: PayloadAction<TriggersState>) => {
            const newTriggers = action.payload.triggers;
            const newRowNum = action.payload.rowNum;

            return {
                triggers: newTriggers,
                rowNum: newRowNum,
            };
        },
        refreshTrigger: (state, action: PayloadAction<TriggerItem>) => {
            const triggers = state.triggers;
            const newTrigger = action.payload;

            if (triggers === null) {
                return {
                    ...state,
                    triggers: [newTrigger],
                };
            }

            const newTriggers = [...triggers];
            const targetIndex = newTriggers.findIndex(
                (trigger) => trigger.id === newTrigger.id
            );
            newTriggers[targetIndex] = {
                ...newTrigger,
            };
            return {
                ...state,
                triggers: newTriggers,
            };
        },
        addTrigger: (state, action: PayloadAction<TriggerItem>) => {
            let triggers = state.triggers;
            const newTrigger = action.payload;

            if (triggers === null) {
                triggers = [];
            }

            return {
                ...state,
                triggers: [newTrigger, ...triggers],
            };
        },
        updateTrigger: (state, action: PayloadAction<Partial<TriggerItem>>) => {
            const triggers = state.triggers;
            const newTrigger = action.payload;

            if (triggers === null) {
                throw new Error('Can not updateTrigger when triggers is null.');
            }

            const newTriggers = [...triggers];
            const targetIndex = newTriggers.findIndex(
                (trigger) => trigger.id === newTrigger.id
            );
            newTriggers[targetIndex] = {
                ...triggers[targetIndex],
                ...newTrigger,
            };

            return {
                ...state,
                triggers: newTriggers,
            };
        },
        deleteTriggers: (state, action: PayloadAction<number[]>) => {
            const triggers = state.triggers;
            const deleteTriggerIds = action.payload;

            if (triggers === null) {
                throw new Error('Can not delete when triggers is null.');
            }

            const updatedTriggers = triggers.filter(
                (trigger) => deleteTriggerIds.indexOf(trigger.id) === -1
            );

            return {
                ...state,
                triggers: updatedTriggers,
            };
        },
    },
});

export const triggersActions = triggersSlice.actions;

export const selectTriggers = (state: RootState) => state.triggers;

export default triggersSlice.reducer;
