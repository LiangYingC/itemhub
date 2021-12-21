import {
    RoutingController
} from '../swim/routing-controller.js';

export class CooperationController extends RoutingController {
    static get id () {
        return 'CooperationController';
    }

    async render () {
        this.meta = {
            title: '與我們聯繫 - ItemHub'
        };
        await super.render({
            ...this.args.me
        });
    }
}
