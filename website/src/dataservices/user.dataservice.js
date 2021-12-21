import {
    ApiHelper
} from '../util/api.js';

import {
    API
} from '../constants.js';

import {
    APP_CONFIG
} from '../config.js';

export const UserDataService = {
    GetNumberOfRegisteredUsers: async () => {
        const api = APP_CONFIG.API_ENDPOINT + API.NUMBER_OF_REGISTERED_USERS;
        return ApiHelper.sendRequest(api, {
            method: 'GET'
        });
    }
};
