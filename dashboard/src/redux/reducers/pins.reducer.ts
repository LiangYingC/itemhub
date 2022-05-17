import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/redux/store';
import { PinItem } from '@/types/devices.type';

export const pinsSlice = createSlice({
    name: 'pins',
    initialState: null as PinItem[] | null,
    reducers: {
        refreshPins: (state, action: PayloadAction<PinItem[]>) => {
            const pins = action.payload;
            return pins;
        },
        refreshPin: (state, action: PayloadAction<PinItem>) => {
            const pins = state;
            const newPin = action.payload;

            if (pins === null) {
                return [newPin];
            }

            const newPins = [...pins];

            const targetIndex = newPins.findIndex(
                (pin) =>
                    pin.deviceId === newPin.deviceId && pin.pin === newPin.pin
            );
            newPins[targetIndex] = {
                ...newPin,
            };
            return newPins;
        },
        updatePin: (state, action: PayloadAction<Partial<PinItem>>) => {
            const pins = state;
            const newPin = action.payload;

            if (pins === null) {
                throw new Error('Can not updatePin when pins is null.');
            }

            const newPins = [...pins];

            const targetIndex = newPins.findIndex(
                (pin) =>
                    pin.deviceId === newPin.deviceId && pin.pin === newPin.pin
            );
            newPins[targetIndex] = {
                ...newPins[targetIndex],
                ...newPin,
            };

            return newPins;
        },
        deleteMultiple: (state, action: PayloadAction<{ pins: string[] }>) => {
            const deletePayload = action.payload;

            if (state === null) {
                throw new Error('Can not delete when pins is null.');
            }

            const newList = state.filter(
                (item) => deletePayload.pins.indexOf(item.pin) === -1
            );
            return newList;
        },
    },
});

export const pinsActions = pinsSlice.actions;

export const selectDevicePins = (state: RootState) => state.pins;

export default pinsSlice.reducer;
