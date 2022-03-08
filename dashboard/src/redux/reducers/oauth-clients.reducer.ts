import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/redux/store';
import { OauthClient } from '@/types/oauth-clients.type';

type OauthClientState = {
    oauthClients: OauthClient[] | null;
    rowNum: number;
};

const initialState: OauthClientState = {
    oauthClients: null,
    rowNum: 0,
};

export const oauthClientsSlice = createSlice({
    name: 'oauth-clients',
    initialState,
    reducers: {
        refresh: (state, action: PayloadAction<OauthClientState>) => {
            const newState = action.payload;
            return newState;
        },
        refreshOne: (state, action: PayloadAction<OauthClient>) => {
            const list = state.oauthClients;
            const newOne = action.payload;

            if (list === null) {
                return {
                    ...state,
                    triggers: [newOne],
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
                oauthClients: list,
            };
        },
        updateOne: (state, action: PayloadAction<Partial<OauthClient>>) => {
            const list = state.oauthClients;
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

            return {
                ...state,
                oauthClients: list,
            };
        },
        addOne: (state, action: PayloadAction<OauthClient>) => {
            let list = state.oauthClients;
            const newOne = action.payload;

            if (list === null) {
                list = [];
            }

            return {
                ...state,
                oauthClients: [newOne, ...list],
            };
        },
        deleteMultiple: (state, action: PayloadAction<{ ids: number[] }>) => {
            const list = state.oauthClients;
            const deletePayload = action.payload;

            if (list === null) {
                throw new Error('Can not delete when oauth-clients is null.');
            }

            const newList = list.filter(
                (item) => deletePayload.ids.indexOf(item.id) === -1
            );

            return {
                ...state,
                oauthClients: newList,
            };
        },
    },
});

export const oauthClientsActions = oauthClientsSlice.actions;

export const selectOauthClients = (state: RootState) => state.oauthClients;

export default oauthClientsSlice.reducer;
