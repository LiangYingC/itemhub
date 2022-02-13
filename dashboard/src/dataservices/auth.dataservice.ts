import { API_URL, END_POINT, FETCH_METHOD } from '@/constants/api';
import { ApiHelper } from '@/helpers/api.helper';

export const AuthDataservice = {
    SignWithEmail: async ({
        email,
        password,
    }: {
        email: string;
        password: string;
    }) => {
        const apiPath = `${API_URL}${END_POINT.SIGN_WITH_EMAIL}`;

        const result = await ApiHelper.sendRequest<{ token: string }>({
            apiPath,
            method: FETCH_METHOD.POST,
            payload: {
                email,
                password,
            },
        });
        return result.data;
    },
    IsSigned: async () => {
        const apiPath = `${API_URL}${END_POINT.IS_SIGNED}`;
        return ApiHelper.sendRequestWithToken({
            apiPath,
            method: FETCH_METHOD.POST,
        });
    },
};
