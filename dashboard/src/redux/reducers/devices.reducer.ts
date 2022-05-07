import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/redux/store';
import { DeviceItem } from '@/types/devices.type';

type DeviceState = {
    devices: DeviceItem[] | null;
    rowNum: number;
};

const initialState: DeviceState = {
    devices: null,
    rowNum: 0,
};

export const devicesSlice = createSlice({
    name: 'devices',
    initialState: initialState,
    reducers: {
        refresh: (state, action: PayloadAction<DeviceState>) => {
            return action.payload;
        },
        refreshOne: (state, action: PayloadAction<DeviceItem>) => {
            const list = state.devices;
            const newOne = action.payload;

            if (list === null) {
                return {
                    ...state,
                    devices: [newOne],
                };
            }

            const targetIndex = list.findIndex(
                (oldOne) => oldOne.id === newOne.id
            );
            list[targetIndex] = {
                ...newOne,
            };

            return {
                ...state,
                devices: list,
            };
        },
        append: (state, action: PayloadAction<DeviceItem>) => {
            const deviceInState = state.devices?.find(
                (item) => item.id === action.payload.id
            );
            const devices = state.devices;
            if (!deviceInState) {
                (devices || []).push(action.payload);
            }
            return {
                ...state,
                devices,
            };
        },
        update: (state, action: PayloadAction<Partial<DeviceItem>>) => {
            const devices = state.devices;
            const newDeviceData = action.payload;

            if (devices === null) {
                throw new Error('Can not updateDevice when devices is null.');
            }

            const targetIndex = devices.findIndex(
                ({ id }) => id === newDeviceData.id
            );
            devices[targetIndex] = {
                ...devices[targetIndex],
                ...newDeviceData,
            };

            return state;
        },
        deleteMultiple: (state, action: PayloadAction<{ ids: number[] }>) => {
            const devices = state.devices;
            const deletePayload = action.payload;

            if (devices === null) {
                throw new Error('Can not updateDevice when devices is null.');
            }

            const newList = devices.filter(
                (item) => deletePayload.ids.indexOf(item.id) === -1
            );

            return {
                ...state,
                oauthClients: newList,
            };
        },
    },
});

export const devicesActions = devicesSlice.actions;

export const selectDevices = (state: RootState) => state.devices;

export default devicesSlice.reducer;
