import {
    RoutingController
} from '../swim/routing-controller.js';

export class PrivacyPolicyController extends RoutingController {
    static get id () {
        return 'PrivacyPolicyController';
    }

    async render () {
        this.meta = {
            title: '隱私權政策 - ItemHub'
        };
        await super.render({
        });
    }
}
