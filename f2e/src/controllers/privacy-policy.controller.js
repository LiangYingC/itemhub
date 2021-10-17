import {
    RoutingController
} from '../swim/routing-controller.js';

export class PrivacyPolicyController extends RoutingController {
    static get id () {
        return 'PrivacyPolicyController';
    }

    async render () {
        await super.render({
        });
    }
}
