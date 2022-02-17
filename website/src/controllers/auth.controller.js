import {
    RoutingController
} from '../swim/routing-controller.js';
import { Toaster } from '../util/toaster.js';

export class AuthController extends RoutingController {
    constructor (elHTML, parentController, args, context) {
        super(elHTML, parentController, args, context);
        this.Toaster = Toaster;
    }

    static get id () {
        return 'AuthController';
    }
}
