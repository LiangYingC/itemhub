import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/redux/store';
import { DeviceList } from '@/types/devices.type';

export const devicesSlice = createSlice({
    name: 'devices',
    initialState: null as DeviceList | null,
    reducers: {
        addDevices: (state, action: PayloadAction<DeviceList>) => {
            return state === null
                ? action.payload
                : state.concat(action.payload);
        },
    },
});

export const devicesActions = devicesSlice.actions;

export const selectDevices = (state: RootState) => state.devices;

export default devicesSlice.reducer;
