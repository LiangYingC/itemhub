import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/redux/store';
import { TriggerOerator } from '@/types/universal.type';
import { FirmwareType } from '@/types/universal.type';

interface UniversalState {
    triggerOperators: TriggerOerator[];
    firmwareTypes: FirmwareType[];
}

const initialState: UniversalState = {
    triggerOperators: [],
    firmwareTypes: [],
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
        setFirmwareTypes: (state, action: PayloadAction<FirmwareType[]>) => {
            const newFirmwareTypes = action.payload;
            return {
                ...state,
                firmwareTypes: newFirmwareTypes,
            };
        },
    },
});

export const universalActions = universalSlice.actions;

export const selectUniversal = (state: RootState) => state.universal;

export default universalSlice.reducer;
