import {
    RoutingController
} from '../swim/routing-controller.js';
import { RESPONSE_STATUS } from '../constants.js';
import { AuthDataService } from '../dataservices/auth.dataservice.js';
import { CookieUtil } from '../util/cookie.js';
import { Toaster } from '../util/toaster.js';

export class VerifyEmailController extends RoutingController {
    static get id () {
        return 'VerifyEmailController';
    }

    async render () {
        await super.render({
        });
    }

    async exit (args) {
        return super.exit(args);
    }

    async verifyEmail (event) {
        const elButton = event.currentTarget;
        elButton.setAttribute('disabeld', 'disabeld');
        const elForm = elButton.closest('.form');
        const data = {
            ...elForm.collectFormData(),
            email: CookieUtil.getCookie('email')
        };
        const resp = await AuthDataService.VerifyEmail(data);
        elButton.removeAttribute('disabled');
        if (resp.status !== RESPONSE_STATUS.OK) {
            Toaster.popup(Toaster.TYPE.ERROR, resp.data.message);
            return;
        }
        CookieUtil.setCookie('signUpToken', resp.data.token);
        history.pushState({}, '', '/sign-up/');
    }
}
