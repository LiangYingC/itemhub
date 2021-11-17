import {
    RoutingController
} from '../swim/routing-controller.js';

export class CooperationController extends RoutingController {
    static get id () {
        return 'CooperationController';
    }

    async render () {
        await super.render({
            ...this.args.me
        });
    }
}
