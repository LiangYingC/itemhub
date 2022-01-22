import { END_POINT } from '../constants';
import { ApiHelper } from '../helpers/api.helper';

export const AuthDataservice = {
    IsSigned: async (token: string) => {
        return ApiHelper.SendRequestWithToken(
            `${import.meta.env.VITE_API_ENDPOINT}${END_POINT.IS_SIGNED}`,
            {
                token,
            },
            'POST'
        );
    },
};
