import {
    ApiHelper
} from '../util/api.js';

import {
    API
} from '../constants.js';

import {
    APP_CONFIG
} from '../config.js';

export const AuthDataService = {
    SendVerifyEmail: async (data) => {
        const api = APP_CONFIG.API_ENDPOINT + API.SEND_VERIFY_EMAIL;
        return ApiHelper.sendRequest(api, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    VerifyEmail: async (data) => {
        const api = APP_CONFIG.API_ENDPOINT + API.VERIFY_EMAIL;
        return ApiHelper.sendRequest(api, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    SignUp: async (data) => {
        const api = APP_CONFIG.API_ENDPOINT + API.SIGN_UP;
        const token = data.token;
        delete data.token;
        return ApiHelper.sendRequest(api, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                Authorization: 'Bearer ' + token
            }
        });
    },
    SignIn: async (data) => {
        const api = APP_CONFIG.API_ENDPOINT + API.SIGN_IN_WITH_EMAIL;
        delete data.token;
        return ApiHelper.sendRequest(api, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    AuthWithSocialMedia: async (data) => {
        const api = APP_CONFIG.API_ENDPOINT + API.AUTH_WITH_SOCIAL_MEDIA;
        return ApiHelper.sendRequest(api, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    SignInWithSocialMedia: async (data) => {
        const api = APP_CONFIG.API_ENDPOINT + API.SIGN_IN_WITH_SOCIAL_MEDIA;
        return ApiHelper.sendRequest(api, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
};
