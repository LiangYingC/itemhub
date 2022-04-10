import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/redux/store';
import { TriggerOerator } from '@/types/universal.type';

interface UniversalState {
    triggerOperators: TriggerOerator[];
}

const initialState: UniversalState = {
    triggerOperators: [],
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
    },
});

export const universalActions = universalSlice.actions;

export const selectUniversal = (state: RootState) => state.universal;

export default universalSlice.reducer;
