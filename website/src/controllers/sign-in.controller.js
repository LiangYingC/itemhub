import { RESPONSE_STATUS } from '../constants.js';
import { AuthDataService } from '../dataservices/auth.dataservice.js';
import {
    RoutingController
} from '../swim/routing-controller.js';
import { CookieUtil } from '../util/cookie.js';
import { Toaster } from '../util/toaster.js';
import { Validate } from '../util/validate.js';

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

    handleInputTypeEnter (event) {
        if (event.keyCode === 13) {
            this.elHTML.querySelector('.btn-sign-in').click();
        }
    }

    async signIn (event) {
        // validation
        const elButton = event.currentTarget;
        const elForm = elButton.closest('.form');
        const data = {
            ...elForm.collectFormData()
        };
        this.elHTML.querySelectorAll('[data-field]').forEach(elItem => {
            elItem.classList.remove('invalid');
        });
        this.elHTML.querySelectorAll('.validation').forEach((elItem) => {
            elItem.innerHTML = '';
        });
        const validationMessage = [];

        if (!data.email) {
            validationMessage.push({ key: 'email', message: 'email 為必填欄位' });
        }

        if (!Validate.Email(data.email)) {
            validationMessage.push({ key: 'email', message: 'email 格式錯誤' });
        }

        if (!data.password) {
            validationMessage.push({ key: 'password', message: '密碼為必填欄位' });
        }

        if (!Validate.MinLength(data.password, 12)) {
            validationMessage.push({ key: 'password', message: '密碼最小長度為 12' });
        }

        if (validationMessage.length > 0) {
            for (let i = 0; i < validationMessage.length; i++) {
                const elInput = this.elHTML.querySelector(`[data-field="${validationMessage[i].key}"]`);
                const elFormInputContainer = elInput.closest('label');
                const elValidation = elFormInputContainer.querySelector('.validation');
                if (!elInput.classList.contains('invalid')) {
                    elInput.classList.add('invalid');
                }
                elValidation.innerHTML = `${elValidation.innerHTML} ${validationMessage[i].message}`;
            }
            this.elHTML.querySelector(`[data-field="${validationMessage[0].key}"]`).focus();
            return;
        }

        elButton.setAttribute('disabled', 'disabled');
        const resp = await AuthDataService.SignIn(data);
        elButton.removeAttribute('disabled');
        if (resp.status !== RESPONSE_STATUS.OK) {
            Toaster.popup(Toaster.TYPE.ERROR, resp.data.message);
            return;
        }
        CookieUtil.setCookie('token', resp.data.token);
        history.replaceState({}, '', '/me/');
    }
}
