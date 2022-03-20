import {
    ApiHelper
} from '../util/api.js';

import {
    API
} from '../constants.js';

import {
    APP_CONFIG
} from '../config.js';

export const SubscriptionDataService = {
    GetOneByTransactionId: async (data) => {
        let api = APP_CONFIG.API_ENDPOINT + API.SUBSCRIPTION_BY_TRANSACTION_ID;
        api = api.bind({ id: data.id });
        return ApiHelper.sendRequest(api, {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + data.token
            }
        }, true);
    },
    GetMyCurrentSubscription: async (data) => {
        const api = APP_CONFIG.API_ENDPOINT + API.SUBSCRIPTION;
        return ApiHelper.sendRequest(api, {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + data.token
            }
        });
    },
    Cancel: async (data) => {
        const api = APP_CONFIG.API_ENDPOINT + API.SUBSCRIPTION;
        return ApiHelper.sendRequest(api, {
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer ' + data.token
            }
        });
    }
};
