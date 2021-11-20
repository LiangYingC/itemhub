import { EVENTS, RESPONSE_STATUS } from '../constants.js';
import { AuthDataService } from '../dataservices/auth.dataservice.js';
import {
    RoutingController
} from '../swim/routing-controller.js';
import { CookieUtil } from '../util/cookie.js';
import { Toaster } from '../util/toaster.js';

export class SignUpController extends RoutingController {
    static get id () {
        return 'SignUpController';
    }

    async render () {
        this.meta = {
            title: '註冊 - ItemHub'
        };
        await super.render({
            email: CookieUtil.getCookie('email')
        });
    }

    async signUp (event) {
        const elButton = event.currentTarget;
        elButton.setAttribute('disabled', 'disabled');
        const elForm = elButton.closest('.form');

        const data = {
            ...elForm.collectFormData(),
            email: CookieUtil.getCookie('email'),
            token: CookieUtil.getCookie('signUpToken')
        };

        if (data.password !== data.confirmPassword) {
            Toaster.popup(Toaster.TYPE.WARN, 'Please check your confirm password same as password');
            elButton.removeAttribute('disabled');
            return;
        }

        const resp = await AuthDataService.SignUp(data);
        elButton.removeAttribute('disabled');
        if (resp.status !== RESPONSE_STATUS.OK) {
            Toaster.popup(Toaster.TYPE.ERROR, resp.data.message);
            return;
        }
        CookieUtil.eraseCookie('signUpToken');
        this.args.gtag('event', EVENTS.SIGN_UP);
        CookieUtil.setCookie('token', resp.data.token);
        history.pushState({}, '', '/me/');
    }
}
