import { RESPONSE_STATUS } from '../constants.js';
import { AuthDataService } from '../dataservices/auth.dataservice.js';
import {
    RoutingController
} from '../swim/routing-controller.js';
import { CookieUtil } from '../util/cookie.js';
import { Toaster } from '../util/toaster.js';

export class SignInController extends RoutingController {
    static get id () {
        return 'SignInController';
    }

    async render () {
        this.meta = {
            title: '登入 - ItemHub'
        };
        await super.render({
        });
    }

    async signIn (event) {
        const elButton = event.currentTarget;
        elButton.setAttribute('disabled', 'disabled');
        const elForm = elButton.closest('.form');

        const data = {
            ...elForm.collectFormData()
        };

        const resp = await AuthDataService.SignIn(data);
        elButton.removeAttribute('disabled');
        if (resp.status !== RESPONSE_STATUS.OK) {
            Toaster.popup(Toaster.TYPE.ERROR, resp.data.message);
            return;
        }
        CookieUtil.setCookie('token', resp.data.token);
        const extra = window.jwt_decode(resp.data.token).extra;
        this.args.me.name = `${extra.LastName}${extra.FirstName}`;
        this.args.me.email = `${extra.LastName}${extra.FirstName}`;
        location.href = '/me/';
    }
}
