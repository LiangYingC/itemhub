import { EVENTS } from '../constants.js';
import {
    RoutingController
} from '../swim/routing-controller.js';
import { CookieUtil } from '../util/cookie.js';

export class SignOutController extends RoutingController {
    static get id () {
        return 'SignOutController';
    }

    async render () {
        this.args.gtag('event', EVENTS.SIGN_OUT);
        CookieUtil.eraseCookie('token');
        CookieUtil.eraseCookie('dashboardToken');
        history.pushState({}, '', '/');
    }
}
