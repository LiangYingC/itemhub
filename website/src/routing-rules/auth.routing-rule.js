import { SignInController } from '../controllers/sign-in.controller.js';
import { CookieUtil } from '../util/cookie.js';
import { AuthController } from '../controllers/auth.controller.js';
import { VerifyEmailController } from '../controllers/verify-email.controller.js';
import { SignUpController } from '../controllers/sign-up.controller.js';
import { SignUpFinishController } from '../controllers/sign-up-finish.controller.js';

export const AuthRoutingRule = {
    path: '/auth/',
    controller: AuthController,
    html: '/template/auth.html',
    children: [{
        path: 'sign-in/',
        skipSitemap: true,
        controller: SignInController,
        html: '/template/sign-in.html',
        prepareData: [{
            key: 'isAuth',
            func: () => {
                const token = CookieUtil.getCookie('token');
                const tokenPayload = token ? window.jwt_decode(token) : false;
                if (tokenPayload) {
                    setTimeout(() => {
                        history.replaceState({}, '', '/me/');
                    }, 50);
                    return true;
                }
                return false;
            }
        }]
    }, {
        path: 'verify-email/',
        skipSitemap: true,
        controller: VerifyEmailController,
        html: '/template/verify-email.html'
    }, {
        path: 'sign-up/?verifyPhoneToken',
        skipSitemap: true,
        controller: SignUpController,
        html: '/template/sign-up.html'
    }, {
        path: 'finish/',
        skipSitemap: true,
        controller: SignUpFinishController,
        html: '/template/sign-up-finish.html'
    }]
};
