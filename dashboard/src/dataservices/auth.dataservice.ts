import { API_URL, END_POINT, HTTP_METHOD } from '@/constants/api';
import { ApiHelpers } from '@/helpers/api.helper';

export const AuthDataservices = {
    SignWithEmail: async ({
        email,
        password,
    }: {
        email: string;
        password: string;
    }) => {
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
