import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/redux/store';
import { OauthClient } from '@/types/oauth-clients.type';

export const oauthClientsSlice = createSlice({
    name: 'oauth-clients',
    initialState: null as OauthClient[] | null,
    reducers: {
        refresh: (state, action: PayloadAction<OauthClient[]>) => {
            const list = action.payload;
            return list;
        },
        refreshOne: (state, action: PayloadAction<OauthClient>) => {
            const list = state;
            const newOne = action.payload;

            if (list === null) {
                return [newOne];
            }

            const targetIndex = list.findIndex(
                (oldOne) => oldOne.id === newOne.id
            );
            list[targetIndex] = {
                ...newOne,
            };
            return list;
        },
        updateOne: (state, action: PayloadAction<Partial<OauthClient>>) => {
            const list = state;
            const newOne = action.payload;

            if (list === null) {
                throw new Error(
                    'Can not updateOne when oauth-clients is null.'
                );
            }

            const targetIndex = list.findIndex(({ id }) => id === newOne.id);
            list[targetIndex] = {
                ...list[targetIndex],
                ...newOne,
            };

            return list;
        },
        addOne: (state, action: PayloadAction<OauthClient>) => {
            let list = state;
            const newOne = action.payload;

            if (list === null) {
                list = [];
            }

            list.push(newOne);

            return list;
        },
        deleteMultiple: (state, action: PayloadAction<{ ids: number[] }>) => {
            const list = state;
            const deletePayload = action.payload;

            if (list === null) {
                throw new Error('Can not delete when oauth-clients is null.');
            }

            return list.filter(
                (item) => deletePayload.ids.indexOf(item.id) !== -1
            );
        },
    },
});

export const oauthClientsActions = oauthClientsSlice.actions;

export const selectOauthClients = (state: RootState) => state.oauthClients;

export default oauthClientsSlice.reducer;
