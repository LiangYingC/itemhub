import {
    RoutingController
} from '../swim/routing-controller.js';
import { CookieUtil } from '../util/cookie.js';

export class SignOutController extends RoutingController {
    static get id () {
        return 'SignOutController';
    }

    async render () {
        CookieUtil.eraseCookie('token');
        history.pushState({}, '', '/');
    }
}
