import { OAUTH_PROVIDER, OAUTH_TYPE, THIRD_PARTY_KEY } from '../../constants.js';
import {
    BaseComponent
} from '../../swim/base.component.js';
import { CookieUtil } from '../../util/cookie.js';
import { PopupHelper } from '../../util/popup.helper.js';

export class HeaderComponent extends BaseComponent {
    constructor (elRoot, variable, args) {
        super(elRoot, variable, args);
        this.id = 'HeaderComponent';
    }

    async render () {
        await super.render({
            ...this.variable,
            hasSignedInvisibility: CookieUtil.getCookie('token') ? 'd-none' : 'd-block',
            hasSignedVisibility: CookieUtil.getCookie('token') ? 'd-block' : 'd-none'
        });
    }

    async signInWithFacebook () {
        const state = {
            type: OAUTH_TYPE.SIGN_IN,
            provider: OAUTH_PROVIDER.FACEBOOK
        };
        PopupHelper.PopupCenter(`https://www.facebook.com/v5.0/dialog/oauth?client_id=${THIRD_PARTY_KEY.FB_CLIENT_ID}&redirect_uri=${window.location.origin}/auth/&state=${JSON.stringify(state)}`, 'fb auth', 600, 500);
    }

    async signInWithLine () {
        PopupHelper.PopupCenter(`https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${THIRD_PARTY_KEY.LINE_CLIENT_ID}&redirect_uri=${window.location.origin}/auth/&state=${OAUTH_PROVIDER.LINE},${OAUTH_TYPE.SIGN_IN}&bot_prompt=aggressive&scope=profile%20openid%20email`, 'line auth', 600, 500);
    }

    async signInWithGoogle () {
        const state = {
            type: OAUTH_TYPE.SIGN_IN,
            provider: OAUTH_PROVIDER.GOOGLE
        };
        const url = ['https://accounts.google.com/o/oauth2/v2/auth?1=1', 'scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile', 'include_granted_scopes=true', 'response_type=code', `state=${JSON.stringify(state)}`, `redirect_uri=${location.origin}/auth/`, `client_id=${THIRD_PARTY_KEY.GOOGLE_CLIENT_ID}`].join('&');
        PopupHelper.PopupCenter(url, 'google auth', 600, 500);
    }
}
