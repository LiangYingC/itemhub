import { APP_CONFIG } from '../config.js';
import {
    RoutingController
} from '../swim/routing-controller.js';

export class PricingController extends RoutingController {
    static get id () {
        return 'PricingController';
    }

    async render () {
        this.meta = {
            title: '首波早鳥方案 - ItemHub',
            'og:title': '首波早鳥方案 - ItemHub',
            description: '首波登記用戶即享終身免費升級進階方案，ItemHub 讓你輕鬆簡單連接裝置與感應器，從今天開始你的智慧生活',
            image: `${APP_CONFIG.FRONT_END_URL}/assets/images/share.png`,
            keywords: 'ItemHub,item-hub,物聯網,iot,串聯裝置,連結裝置,早鳥方案,免費升級'
        };
        await super.render({
            numOfRegisteredUser: this.args.numOfRegisteredUser
        });
    }

    async postRender () {
        await super.postRender();
        document.body.addEventListener('CONTEXT_NUM_OF_REGISTERED_USER_CHANGED', this.updateNumOfRegisteredUser);
    }

    async exit () {
        document.body.removeEventListener('CONTEXT_NUM_OF_REGISTERED_USER_CHANGED', this.updateNumOfRegisteredUser);
        return await super.exit();
    }

    updateNumOfRegisteredUser (event) {
        this.pageVariable.numOfRegisteredUser = event.detail.newValue;
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
