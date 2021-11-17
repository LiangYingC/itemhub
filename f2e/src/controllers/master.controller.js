import {
    RoutingController
} from '../swim/routing-controller.js';

export class MasterController extends RoutingController {
    static get id () {
        return 'MasterController';
    }

    async render () {
        await super.render({
            ...this.args.me
        });
    }

    async exit (args) {
        return super.exit(args);
    }
}
