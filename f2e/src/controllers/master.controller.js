import {
    RoutingController
} from '../swim/routing-controller.js';

export class MasterController extends RoutingController {
    static get id () {
        return 'MasterController';
    }

    async render () {
        this.meta = {
            title: 'Item Hub',
            description: 'Item Hub',
            image: '',
            keywords: ''
        };
        await super.render({
            ...this.args.me,
            numberOfPromotedUser: this.args.numberOfRegisteredUsers > 300 ? 0 : 300 - this.args.numberOfRegisteredUsers
        });
    }

    async exit (args) {
        return super.exit(args);
    }
}
