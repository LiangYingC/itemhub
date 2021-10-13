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
    GetAll: async (data) => {
        const api = APP_CONFIG.API_ENDPOINT + API.UNIVERSAL;
        return ApiHelper.sendRequest(api, {
            method: 'GET'
        });
    }
};
