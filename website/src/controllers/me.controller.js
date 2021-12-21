import {
    RoutingController
} from '../swim/routing-controller.js';

export class MeController extends RoutingController {
    static get id () {
        return 'MeController';
    }

    async render () {
        await super.render({
            name: this.args.name
        });
    }

    async exit (args) {
        return super.exit(args);
    }
}
