import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface Device {
    name: string;
}

const initialState: Device[] = [];

export const slicedDevice = createSlice({
    name: 'device',
    initialState,
    reducers: {
        add: (state) => {
            const newRecord: Device = { name: '1' };
            state.push(newRecord);
        },
        addMany: (state, action) => {
            action.payload.forEach((item: Device) => {
                state.push(item);
            });
        },
    },
});

export const { add, addMany } = slicedDevice.actions;

export const selectDevices = (state: RootState) => state.device;

export default slicedDevice.reducer;
