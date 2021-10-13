import {
    RoutingController
} from '../swim/routing-controller.js';
import { OAUTH_PROVIDER, OAUTH_TYPE, RESPONSE_STATUS, THIRD_PARTY_KEY } from '../constants.js';
import { AuthDataService } from '../dataservices/auth.dataservice.js';
import { CookieUtil } from '../util/cookie.js';
import { Toaster } from '../util/toaster.js';
import { PopupHelper } from '../util/popup.helper.js';

export class SendVerifyEmailController extends RoutingController {
    static get id () {
        return 'SendVerifyEmailController';
    }

    async sendVerifyEmail (event) {
        const elButton = event.currentTarget;
        elButton.setAttribute('disabeld', 'disabeld');
        const elForm = elButton.closest('.form');
        const data = elForm.collectFormData();
        const resp = await AuthDataService.SendVerifyEmail(data);
        elButton.removeAttribute('disabled');
        if (resp.status !== RESPONSE_STATUS.OK) {
            Toaster.popup(Toaster.TYPE.ERROR, resp.data.message);
            return;
        }
        CookieUtil.setCookie('email', data.email);
        history.pushState({}, '', '/sign-up/verify-email/');
    }

    async signUpWithFacebook () {
        const state = {
            type: OAUTH_TYPE.SIGN_UP,
            provider: OAUTH_PROVIDER.FACEBOOK
        };
        PopupHelper.PopupCenter(`https://www.facebook.com/v5.0/dialog/oauth?client_id=${THIRD_PARTY_KEY.FB_CLIENT_ID}&redirect_uri=${window.location.origin}/auth/&state=${JSON.stringify(state)}`, 'fb auth', 600, 500);
    }

    async signUpWithGoogle () {
        const state = {
            type: OAUTH_TYPE.SIGN_UP,
            provider: OAUTH_PROVIDER.GOOGLE
        };
        const url = ['https://accounts.google.com/o/oauth2/v2/auth?1=1', 'scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile', 'include_granted_scopes=true', 'response_type=code', `state=${JSON.stringify(state)}`, `redirect_uri=${location.origin}/auth/`, `client_id=${THIRD_PARTY_KEY.GOOGLE_CLIENT_ID}`].join('&');
        PopupHelper.PopupCenter(url, 'google auth', 600, 500);
    }

    async signUpWithLine () {
        PopupHelper.PopupCenter(`https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${THIRD_PARTY_KEY.LINE_CLIENT_ID}&redirect_uri=${window.location.origin}/auth/&state=${OAUTH_PROVIDER.LINE},${OAUTH_TYPE.SIGN_UP}&bot_prompt=aggressive&scope=profile%20openid%20email`, 'line auth', 600, 500);
    }
}
