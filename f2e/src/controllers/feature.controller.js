import {
    RoutingController
} from '../swim/routing-controller.js';

export class FeatureController extends RoutingController {
    static get id () {
        return 'FeatureController';
    }

    async render () {
        this.meta = {
            title: '產品特色 - ItemHub'
        };
        await super.render({
        });
    }
}
