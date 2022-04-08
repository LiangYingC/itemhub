import {
    RoutingController
} from '../swim/routing-controller.js';

export class ResetPasswordFinishController extends RoutingController {
    static get id () {
        return 'ResetPasswordFinishController';
    }

    async render () {
        this.meta = {
            title: '重設密碼成功 - ItemHub'
        };

        await super.render({
        });
    }
}
