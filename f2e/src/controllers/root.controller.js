import { Router } from '../swim/router.js';
import {
    RoutingController
} from '../swim/routing-controller.js';

export class RootController extends RoutingController {
    constructor (elHTML, parentController, args, context) {
        super(elHTML, parentController, args, context);
        Router.interrupt = () => {
            window.scrollTo(0, 0);
        };
    }
}
