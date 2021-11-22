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
        this.meta = {
            title: 'ItemHub',
            'og:title': 'Connect to the world',
            description: 'Let your device connect internet without coding, 無需撰寫程式讓你的裝置輕鬆連上物聯網',
            image: '',
            keywords: 'low-code,no-code,iot platform,iot,internet of thing,iot data center'
        };
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
