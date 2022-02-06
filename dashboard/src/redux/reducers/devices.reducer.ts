import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/redux/store';
import { DeviceList, DeviceItem } from '@/types/devices.type';

export const devicesSlice = createSlice({
    name: 'devices',
    initialState: [] as DeviceList,
    reducers: {
        refreshDevices: (state, action: PayloadAction<DeviceList>) => {
            const newDevices = action.payload;
            return newDevices;
        },
        refreshSingleDevice: (state, action: PayloadAction<DeviceItem>) => {
            const devices = state;
            const newDeviceData = action.payload;

            const targetIndex = devices.findIndex(
                (device) => device.id === newDeviceData.id
            );
            if (targetIndex < 0) {
                devices.push(newDeviceData);
            } else {
                devices[targetIndex] = {
                    ...newDeviceData,
                };
            }

            return devices;
        },
        updateSingleDevice: (
            state,
            action: PayloadAction<Partial<DeviceItem>>
        ) => {
            const devices = state;
            const newDeviceData = action.payload;

            const targetIndex = devices.findIndex(
                ({ id }) => id === newDeviceData.id
            );
            if (targetIndex < 0) {
                throw new Error(
                    'Can not find device which you want to update.'
                );
            }
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
