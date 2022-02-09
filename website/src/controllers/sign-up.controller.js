import {
    RoutingController
} from '../swim/routing-controller.js';

export class SignUpController extends RoutingController {
    static get id () {
        return 'SignUpController';
    }

    async render () {
        this.meta = {
            title: '驗證信箱 - ItemHub'
        };
        await super.render({
        });
    }

    async exit (args) {
        return super.exit(args);
    }

    async sendCodeToPhone (event) {
        const elButton = event.currentTarget;
        elButton.setAttribute('disabled', 'disabled');
        elButton.removeAttribute('disabled');
    }

    validateCode () {
    }

    validatePassword () {
    }

    async signUp () {
    }
}
