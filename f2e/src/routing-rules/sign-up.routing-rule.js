import { SendVerifyEmailController } from '../controllers/send-verify-email.controller.js';
import { VerifyEmailController } from '../controllers/verify-email.controller.js';
import { SignUpController } from '../controllers/sign-up.controller.js';

export const SignUpRoutingRule = {
    path: 'sign-up/',
    controller: SignUpController,
    html: '/template/sign-up.html',
    children: [{
        path: 'send-verify-email/',
        controller: SendVerifyEmailController,
        html: '/template/send-verify-email.html'
    }, {
        path: 'verify-email/',
        controller: VerifyEmailController,
        html: '/template/verify-email.html'
    }]
};
