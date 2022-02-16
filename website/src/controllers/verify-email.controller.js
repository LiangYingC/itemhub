import {
    RoutingController
} from '../swim/routing-controller.js';
import { ERROR_KEYS, RESPONSE_STATUS } from '../constants.js';
import { AuthDataService } from '../dataservices/auth.dataservice.js';
import { Toaster } from '../util/toaster.js';

export class VerifyEmailController extends RoutingController {
    constructor (elHTML, parentController, args, context) {
        super(elHTML, parentController, args, context);
        this.resendTimer = null;
        this.resendTime = 0;
    }

    static get id () {
        return 'VerifyEmailController';
    }

    async render () {
        this.meta = {
            title: '驗證信箱 - ItemHub'
        };
        await super.render({
            emailInvalidMessage: '',
            codeInvalidMessage: ''
        });
    }

    validateEmail (event) {
        const elBtnSendVerifyEmail = this.elHTML.querySelector('.btn-send-verify-email');
        if (event.keyCode === 13) {
            elBtnSendVerifyEmail.click();
            return;
        }

        const elEmail = this.elHTML.querySelector('[data-field="email"]');
        const email = elEmail.value;
        const emailPattern = /^[a-zA-Z0-9+._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        const isValid = emailPattern.test(email);
        if (isValid) {
            elBtnSendVerifyEmail.removeAttribute('disabled');
            this.pageVariable.emailInvalidMessage = '';
        } else {
            elBtnSendVerifyEmail.setAttribute('disabled', 'disabled');
            this.pageVariable.emailInvalidMessage = 'Email 格式錯誤';
        }
    }

    async sendVerifyEmail (event) {
        const elButton = event.currentTarget;
        elButton.setAttribute('disabled', 'disabled');
        const elForm = elButton.closest('.form');
        const data = {
            ...elForm.collectFormData()
        };
        elButton.innerHTML = '寄送中...';
        const elEmail = this.elHTML.querySelector('[data-field="email"]');
        elEmail.setAttribute('disabled', 'disabled');
        const resp = await AuthDataService.SendVerifyEmail(data);
        if (resp.status !== RESPONSE_STATUS.OK && resp.data.errorKey === ERROR_KEYS.SIGN_IN_BY_OTHER_WAY) {
            const duplicateProviderMessag = [];
            for (const provider in resp.data.payload.duplicatedUserProvider) {
                duplicateProviderMessag.push(`${provider}: ${resp.data.payload.duplicatedUserProvider[provider]}`);
            }
            Toaster.popup(Toaster.TYPE.ERROR, `你已經註冊過囉~ 你所登入的方式是 <br/> ${duplicateProviderMessag.join('<br/>')}`);

            elButton.innerHTML = '傳送驗證碼至信箱';
            elButton.removeAttribute('disabled');
            elEmail.removeAttribute('disabled');
        } else if (resp.status !== RESPONSE_STATUS.OK) {
            Toaster.popup(Toaster.TYPE.ERROR, resp.data.message);

            elButton.innerHTML = '傳送驗證碼至信箱';
            elButton.removeAttribute('disabled');
            elEmail.removeAttribute('disabled');
        } else {
            this.elHTML.querySelector('[data-field="code"]').removeAttribute('disabled');
            this._countdownResendTimerStart();
        }
    }

    validateCode (event) {
        if (event.keyCode === 13) {
            this.elHTML.querySelector('.btn-next').click();
            return;
        }
        const elNextButton = this.elHTML.querySelector('.btn-next');
        const code = event.currentTarget.value;
        if (code.length === 6 && !isNaN(code)) {
            this.pageVariable.codeInvalidMessage = '';
            elNextButton.removeAttribute('disabled');
        } else {
            this.pageVariable.codeInvalidMessage = '驗證碼格式錯誤';
            elNextButton.setAttribute('disabled', 'disabled');
        }
    }

    async getValidatedEmailToken (event) {
        const elForm = event.currentTarget.closest('.form');
        const data = elForm.collectFormData();
        const resp = await AuthDataService.VerifyEmail({
            ...data,
            token: this.args.token
        });
        if (resp.status !== RESPONSE_STATUS.OK) {
            this.pageVariable.codeInvalidMessage = resp.data.message;
            return;
        }
        history.pushState({}, '', `/auth/sign-up/?signUpToken=${resp.data.token}`);
    }

    _countdownResendTimerStart () {
        clearTimeout(this.resendTimer);
        this.resendTime = 60;
        this._countdownMain();
    }

    _countdownMain () {
        const elSendVerifyMailButton = this.elHTML.querySelector('.btn-send-verify-email');
        if (this.resendTime <= 0) {
            elSendVerifyMailButton.innerHTML = '傳送驗證碼至信箱';
            elSendVerifyMailButton.removeAttribute('disabled');
            this.elHTML.querySelector('[data-field="code"]').setAttribute('disabled', 'disabled');
            this.elHTML.querySelector('.btn-next').setAttribute('disabled', 'disabled');
            this.elHTML.querySelector('[data-field="email"]').removeAttribute('disabled', 'disabled');
            this.resendTimer = null;
            this.resendTime = 0;
            return;
        }
        this.resendTime -= 1;
        elSendVerifyMailButton.innerHTML = `可於 ${this.resendTime} 秒後重送`;
        this.resendTimer = setTimeout(() => {
            this._countdownMain();
        }, 1000);
    }
}
