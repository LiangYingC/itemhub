import { SignInController } from '../controllers/sign-in.controller.js';
import { CookieUtil } from '../util/cookie.js';
import { AuthController } from '../controllers/auth.controller.js';
import { VerifyEmailController } from '../controllers/verify-email.controller.js';
import { SignUpController } from '../controllers/sign-up.controller.js';
import { SignUpFinishController } from '../controllers/sign-up-finish.controller.js';
import { TwoFactorAuthController } from '../controllers/two-factor-auth.controller.js';
import { ForgetPasswordController } from '../controllers/forget-password.js';
import { ResetPasswordController } from '../controllers/reset-password.js';
import { ResetPasswordFinishController } from '../controllers/reset-password-finish.js';

export const AuthRoutingRule = {
    path: '/auth/',
    skipSitemap: true,
    controller: AuthController,
    html: '/template/auth.html',
    children: [{
        path: 'sign-in/?redirectUrl',
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
    }, {
        path: 'two-factor-auth/',
        skipSitemap: true,
        controller: TwoFactorAuthController,
        html: '/template/two-factor-auth.html'
    }, {
        path: 'forget-password/',
        skipSitemap: true,
        controller: ForgetPasswordController,
        html: '/template/forget-password.html'
    }, {
        path: 'reset-password/?token',
        skipSitemap: true,
        controller: ResetPasswordController,
        html: '/template/reset-password.html'
    }, {
        path: 'reset-password-finish/',
        skipSitemap: true,
        controller: ResetPasswordFinishController,
        html: '/template/reset-password-finish.html'
    }]
};
