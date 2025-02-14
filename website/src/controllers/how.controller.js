import { APP_CONFIG } from '../config.js';
import {
    RoutingController
} from '../swim/routing-controller.js';

export class HowController extends RoutingController {
    static get id () {
        return 'HowController';
    }

    async render () {
        this.meta = {
            title: '如何使用 - ItemHub',
            'og:title': '如何使用 - ItemHub',
            description: '簡單快速三步驟，即可完成連接與使用設定，串聯你的裝置或感應器就是這麼輕鬆簡單，ItemHub 讓你專注在智慧裝置的運用，從今天開始你的智慧生活',
            image: `${APP_CONFIG.FRONT_END_URL}/assets/images/share.png`,
            keywords: 'ItemHub,item-hub,物聯網,iot,串聯裝置,連結裝置,low-code,no-code,iot platform,iot,internet of thing,iot data center'
        };
        await super.render({
            expandedHowToBindGoogleSmartHomeVisible: 'd-none',
            expandedHowToStartVisible: 'd-none'
        });
    }

    toggleHowToBindSmartHome () {
        if (this.pageVariable.expandedHowToBindGoogleSmartHomeVisible === '') {
            this.pageVariable.expandedHowToBindGoogleSmartHomeVisible = 'd-none';
        } else {
            this.pageVariable.expandedHowToBindGoogleSmartHomeVisible = '';
        }
    }

    toggleHowToStart () {
        if (this.pageVariable.expandedHowToStartVisible === '') {
            this.pageVariable.expandedHowToStartVisible = 'd-none';
        } else {
            this.pageVariable.expandedHowToStartVisible = '';
        }
    }
}
