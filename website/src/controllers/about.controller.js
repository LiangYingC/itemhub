import {
    RoutingController
} from '../swim/routing-controller.js';

export class AboutController extends RoutingController {
    static get id () {
        return 'AboutController';
    }

    async render () {
        this.meta = {
            title: '關於我們 - ItemHub'
        };
        await super.render({
            ...this.args.me
        });
    }
}
