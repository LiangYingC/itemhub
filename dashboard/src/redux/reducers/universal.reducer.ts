import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/redux/store';
import { TriggerOerator } from '@/types/universal.type';
import { Microcontroller } from '@/types/universal.type';

interface UniversalState {
    triggerOperators: TriggerOerator[];
    microcontrollers: Microcontroller[];
}

const initialState: UniversalState = {
    triggerOperators: [],
    microcontrollers: [],
};

export const universalSlice = createSlice({
    name: 'universal',
    initialState,
    reducers: {
        setTriggerOperators: (
            state,
            action: PayloadAction<TriggerOerator[]>
        ) => {
            const newTriggerOerators = action.payload;
            return {
                ...state,
                triggerOperators: newTriggerOerators,
            };
        },
        setMicrocontrollers: (
            state,
            action: PayloadAction<Microcontroller[]>
        ) => {
            const newMicrocontrollers = action.payload;
            return {
                ...state,
                microcontrollers: newMicrocontrollers,
            };
        },
    },
});

export const universalActions = universalSlice.actions;

export const selectUniversal = (state: RootState) => state.universal;

export default universalSlice.reducer;
