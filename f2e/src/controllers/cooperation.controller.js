import {
    RoutingController
} from '../swim/routing-controller.js';

export class CooperationController extends RoutingController {
    static get id () {
        return 'CooperationController';
    }

    async render () {
        await super.render({
            email: this.args.email,
            name: this.args.name
        });
    }

    sendGuestMessage () {
        console.log('sendGuestMessage');
    }
}
