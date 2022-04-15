import {
    RoutingController
} from '../swim/routing-controller.js';

export class AgreementsController extends RoutingController {
    static get id () {
        return 'AgreementsController';
    }

    async render () {
        this.meta = {
            title: '服務條款 - ItemHub'
        };
        await super.render({
            ...this.args.me
        });
    }
}
