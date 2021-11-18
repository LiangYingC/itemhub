import {
    RoutingController
} from '../swim/routing-controller.js';

export class PricingController extends RoutingController {
    static get id () {
        return 'PricingController';
    }

    async render () {
        await super.render({
            numberOfPromotedUser: this.args.numberOfRegisteredUsers > 300 ? 0 : 300 - this.args.numberOfRegisteredUsers
        });
    }
}
