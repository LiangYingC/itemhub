import { API_URL, END_POINT, HTTP_METHOD } from '@/constants/api';
import { ApiHelpers } from '@/helpers/api.helper';
import { AuthDataservicesInterface } from '@/types/dataservices.type';

export const AuthDataservices: AuthDataservicesInterface = {
    SignWithEmail: async ({ email, password }) => {
        const apiPath = `${API_URL}${END_POINT.SIGN_WITH_EMAIL}`;
        const result = await ApiHelpers.SendRequest<{ token: string }>({
            apiPath,
            method: HTTP_METHOD.POST,
            payload: {
                email,
                password,
            },
        });
        return result.data;
    },
    IsSigned: async () => {
        const apiPath = `${API_URL}${END_POINT.IS_SIGNED}`;
        const result = await ApiHelpers.SendRequestWithToken<{
            state: boolean;
        }>({
            apiPath,
            method: HTTP_METHOD.POST,
        });
        return result.data;
    },
};
