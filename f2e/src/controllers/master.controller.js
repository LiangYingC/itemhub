import { RESPONSE_STATUS } from '../constants.js';
import { UserDataService } from '../dataservices/user.dataservice.js';
import {
    RoutingController
} from '../swim/routing-controller.js';

export class MasterController extends RoutingController {
    static get id () {
        return 'MasterController';
    }

    async render () {
        await super.render({
            ...this.args.me,
            numOfRegisteredUser: this.args.numOfRegisteredUser || 0,
            user: this.args.me
        });
        UserDataService.GetNumberOfRegisteredUsers()
            .then(resp => {
                if (resp.status === RESPONSE_STATUS.OK) {
                    this.args.numOfRegisteredUser = resp.data.nums;
                    this.pageVariable.numOfRegisteredUser = resp.data.nums;
                }
            });
    }

    computed () {
        return [{
            watchKey: 'numOfRegisteredUser',
            variableName: 'numberOfPromotedUser',
            value: () => {
                return this.pageVariable.numOfRegisteredUser && this.pageVariable.numOfRegisteredUser > 300 ? 0 : 300 - this.pageVariable.numOfRegisteredUser;
            }
        }];
    }

    async exit (args) {
        return super.exit(args);
    }
}
