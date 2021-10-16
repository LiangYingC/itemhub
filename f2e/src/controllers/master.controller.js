import {
    RoutingController
} from '../swim/routing-controller.js';

export class MasterController extends RoutingController {
    static get id () {
        return 'MasterController';
    }

    async render () {
        await super.render({
            name: this.args.name,
            email: this.args.email
        });
    }

    async exit (args) {
        return super.exit(args);
    }
}
