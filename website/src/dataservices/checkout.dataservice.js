import {
    ApiHelper
} from '../util/api.js';

import {
    API
} from '../constants.js';

import {
    APP_CONFIG
} from '../config.js';

export const CheckoutDataService = {
    Checkout: async (data) => {
        const api = APP_CONFIG.API_ENDPOINT + API.CHECKOUT;
        const token = data.token;
        delete data.token;
        return ApiHelper.sendRequest(api, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                Authorization: 'Bearer ' + token
            }
        });
    }
};
