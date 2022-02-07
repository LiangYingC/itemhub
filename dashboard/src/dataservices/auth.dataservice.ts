import { API_URL, END_POINT } from '@/constants/api';
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

        const response: any = await ApiHelper.SendRequest({
            apiPath,
            method: 'POST',
            payload: {
                email,
                password,
            },
        });

        return response.data as { token: string };
    },
    IsSigned: async () => {
        const apiPath = `${API_URL}${END_POINT.IS_SIGNED}`;
        return ApiHelper.SendRequestWithToken({
            apiPath,
            method: 'POST',
        });
    },
};
