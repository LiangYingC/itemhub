import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/redux/store';

export const menuSlice = createSlice({
    name: 'menu',
    initialState: { isOpen: true },
    reducers: {
        open: () => {
            return { isOpen: true };
        },
        close: () => {
            return { isOpen: false };
        },
    },
});

export const menuActions = menuSlice.actions;

export const selectMenu = (state: RootState) => state;

export default menuSlice.reducer;
