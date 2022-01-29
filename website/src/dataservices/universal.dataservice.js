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
    GetSocialMediaTypes: async () => {
        const api = APP_CONFIG.API_ENDPOINT + API.UNIVERSAL_SOCIAL_MEDIA_TYPE;
        return ApiHelper.sendRequest(api, {
            method: 'GET'
        });
    },
    GetPricingPlan: async () => {
        const api = APP_CONFIG.API_ENDPOINT + API.UNIVERSAL_PRICING_PLANS;
        return ApiHelper.sendRequest(api, {
            method: 'GET'
        });
    }
};
