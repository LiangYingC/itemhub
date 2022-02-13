import { API_URL, END_POINT, FETCH_METHOD } from '@/constants/api';
import { ApiHelper } from '@/helpers/api.helper';
import { AuthDataserviceInterface } from '@/types/dataservices.type';

export const AuthDataservice: AuthDataserviceInterface = {
    signWithEmail: async ({ email, password }) => {
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
    isSigned: async () => {
        const apiPath = `${API_URL}${END_POINT.IS_SIGNED}`;
        const result = await ApiHelper.sendRequestWithToken<{
            state: boolean;
        }>({
            apiPath,
            method: FETCH_METHOD.POST,
        });
        return result.data;
    },
};
