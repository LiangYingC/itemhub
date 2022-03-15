import { APP_CONFIG } from '../config.js';
import {
    RoutingController
} from '../swim/routing-controller.js';
import { CookieUtil } from '../util/cookie.js';

export class SignUpFinishController extends RoutingController {
    static get id () {
        return 'SignUpFinishController';
    }

    async render () {
        let dashboardUrl = APP_CONFIG.DASHBOARD_URL;

        if (APP_CONFIG.ENV === 'dev') {
            const dashboardToken = CookieUtil.getCookie('dashboardToken');
            dashboardUrl += `?dashboardToken=${dashboardToken}`;
        }
        await super.render({
            DASHBOARD_URL: dashboardUrl
        });
    }
}
