import {
    ApiHelper
} from '../util/api.js';

import {
    API
} from '../constants.js';

import {
    APP_CONFIG
} from '../config.js';

export const UniversalDataService = {
    GetSocialMediaTypes: async (data) => {
        console.log('testing');
        const api = APP_CONFIG.API_ENDPOINT + API.UNIVERSAL_SOCIAL_MEDIA_TYPE;
        return ApiHelper.sendRequest(api, {
            method: 'GET'
        });
    }
};
