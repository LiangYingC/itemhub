import {
    RoutingController
} from '../swim/routing-controller.js';
import { Toaster } from '../util/toaster.js';

export class MasterController extends RoutingController {
    constructor (elHTML, parentController, args, context) {
        super(elHTML, parentController, args, context);
        this.Toaster = Toaster;
    }

    static get id () {
        return 'MasterController';
    }

    async render () {
        await super.render({
            ...this.args.me,
            user: this.args.me
        });
    }
}
