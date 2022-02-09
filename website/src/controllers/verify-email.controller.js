import {
    RoutingController
} from '../swim/routing-controller.js';
import { RESPONSE_STATUS } from '../constants.js';
import { AuthDataService } from '../dataservices/auth.dataservice.js';
import { Toaster } from '../util/toaster.js';

export class VerifyEmailController extends RoutingController {
    static get id () {
        return 'VerifyEmailController';
    }

    async render () {
        this.meta = {
            title: '驗證信箱 - ItemHub'
        };
        await super.render({
        });
    }

    validateEmail () {
        const elEmail = this.elHTML.querySelector('[data-field="email"]');
        const email = elEmail.value;
        const elBtnSendVerifyEmail = this.elHTML.querySelector('.btn-send-verify-email');
        const emailPattern = /^[a-zA-Z0-9+._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        const isValid = emailPattern.test(email);
        if (isValid) {
            elBtnSendVerifyEmail.removeAttribute('disabled');
        } else {
            elBtnSendVerifyEmail.setAttribute('disabled', 'disabled');
        }
    }

    async sendVerifyEmail (event) {
        const elButton = event.currentTarget;
        elButton.setAttribute('disabled', 'disabled');
        const elForm = elButton.closest('.form');
        const data = {
            ...elForm.collectFormData()
        };

        const resp = await AuthDataService.SendVerifyEmail(data);
        elButton.removeAttribute('disabled');
        if (resp.status !== RESPONSE_STATUS.OK) {
            if (resp.data.errorKey === 'SIGN_IN_BY_OTHER_WAY') {
                const duplicateProviderMessag = [];
                for (const provider in resp.data.payload.duplicatedUserProvider) {
                    duplicateProviderMessag.push(`${provider}: ${resp.data.payload.duplicatedUserProvider[provider]}`);
                }
                Toaster.popup(Toaster.TYPE.ERROR, `你已經註冊過囉~ 你所登入的方式是 <br/> ${duplicateProviderMessag.join('<br/>')}`);
                return;
            }
            Toaster.popup(Toaster.TYPE.ERROR, resp.data.message);
        }
    }

    validateCode () {
    }

    getValidatedEmailToken () {
        history.pushState({}, '', '/auth/sign-up/');
    }
}
