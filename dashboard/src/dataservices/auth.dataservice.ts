import { END_POINT } from '../constants';
import { ApiHelper } from '../helpers/api.helper';

export const AuthDataservice = {
    IsSignIn: async (token: string) => {
        return ApiHelper.SendRequestWithToken(
            `${END_POINT.API}${END_POINT.IS_SIGN_IN}`,
            {
                token,
            },
            'POST'
        );
    },
};
