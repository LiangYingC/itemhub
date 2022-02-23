import {
    ApiHelper
} from '../util/api.js';

import {
    API
} from '../constants.js';

import {
    APP_CONFIG
} from '../config.js';

export const TransactionDataService = {
    GetOne: async (data) => {
        let api = APP_CONFIG.API_ENDPOINT + API.TRANSACTION;
        api = api.bind({ id: data.id });
        return ApiHelper.sendRequest(api, {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + data.token
            }
        }, true);
    }
};
