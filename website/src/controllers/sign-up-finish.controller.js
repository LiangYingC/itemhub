import { APP_CONFIG } from '../config.js';
import {
    RoutingController
} from '../swim/routing-controller.js';

export class SignUpFinishController extends RoutingController {
    static get id () {
        return 'SignUpFinishController';
    }

    async render () {
        await super.render({
            DASHBOARD_URL: APP_CONFIG.DASHBOARD_URL
        });
    }
}
