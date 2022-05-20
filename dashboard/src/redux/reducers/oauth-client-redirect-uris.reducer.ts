import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/redux/store';
import { OauthClientRedirectUri } from '@/types/oauth-client-redirect-uris.type';

const initialState: OauthClientRedirectUri[] = [];

export const oauthClientRedirectUrisSlice = createSlice({
    name: 'oauth-client-redirect-uris',
    initialState,
    reducers: {
        refresh: (state, action: PayloadAction<OauthClientRedirectUri[]>) => {
            return [...action.payload];
        },
        deleteMultiple: (state, action: PayloadAction<number[]>) => {
            const list = state;
            const deletePayload = action.payload;

            if (list === null) {
                throw new Error(
                    'Can not delete when oauth-client-redirect-uris is null.'
                );
            }

            return list.filter((item) => deletePayload.indexOf(item.id) === -1);
        },
        appendMultiple: (
            state,
            action: PayloadAction<OauthClientRedirectUri[]>
        ) => {
            return [...state, ...action.payload];
        },
    },
});

export const oauthClientRedirctUrisActions =
    oauthClientRedirectUrisSlice.actions;

export const selectOauthClientRedirectUris = (state: RootState) =>
    state.oauthClientRedirectUris;

export default oauthClientRedirectUrisSlice.reducer;
