import { APP_CONFIG } from '../config.js';
import { RESPONSE_STATUS } from '../constants.js';
import { UserDataService } from '../dataservices/user.dataservice.js';
import {
    RoutingController
} from '../swim/routing-controller.js';

export class MainController extends RoutingController {
    async render () {
        this.meta = {
            title: 'ItemHub',
            'og:title': 'ItemHub',
            description: '串聯你的裝置與感應器就是這麼輕鬆簡單，ItemHub 讓你專注在智慧裝置的運用，從今天開始你的智慧生活',
            image: `${APP_CONFIG.FRONT_END_URL}/assets/images/share.png`,
            keywords: 'ItemHub,item-hub,物聯網,iot,串聯裝置,連結裝置,low-code,no-code,iot platform,iot,internet of thing,iot data center'
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
}
