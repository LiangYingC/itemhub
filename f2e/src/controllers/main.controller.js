import {
    RoutingController
} from '../swim/routing-controller.js';

export class MainController extends RoutingController {
    async render () {
        await super.render({
            ...this.args.me,
            numOfRegisteredUser: this.args.numOfRegisteredUser || 0,
            user: this.args.me
        });
    }
}
