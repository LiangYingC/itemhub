import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/redux/store';
import { DeviceList, DeviceItem } from '@/types/devices.type';

export const devicesSlice = createSlice({
    name: 'devices',
    initialState: null as DeviceList | null,
    reducers: {
        refreshDevices: (_, action: PayloadAction<DeviceList>) => {
            const newDevices = action.payload;
            return newDevices;
        },
        refreshSingleDevice: (state, action: PayloadAction<DeviceItem>) => {
            const devices = state;
            const newDeviceData = action.payload;

            if (devices === null) {
                return [newDeviceData];
            }

            const targetIndex = devices.findIndex(
                (device) => device.id === newDeviceData.id
            );
            devices[targetIndex] = {
                ...newDeviceData,
            };
            return devices;
        },
        updateSingleDevice: (
            state,
            action: PayloadAction<Partial<DeviceItem>>
        ) => {
            const devices = state;
            const newDeviceData = action.payload;

            if (devices === null) {
                throw new Error(
                    'Can not updateSingleDevice when devices is null.'
                );
            }

            const targetIndex = devices.findIndex(
                ({ id }) => id === newDeviceData.id
            );
            devices[targetIndex] = {
                ...devices[targetIndex],
                ...newDeviceData,
            };

            return devices;
        },
    },
});

export const devicesActions = devicesSlice.actions;

export const selectDevices = (state: RootState) => state.devices;

export default devicesSlice.reducer;
