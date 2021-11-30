import { APP_CONFIG } from '../config.js';
import {
    RoutingController
} from '../swim/routing-controller.js';

export class FeatureController extends RoutingController {
    static get id () {
        return 'FeatureController';
    }

    async render () {
        this.meta = {
            title: '產品特色 - ItemHub',
            'og:title': '產品特色 - ItemHub',
            description: '簡單三步驟輕鬆的串聯並操控各項裝置，採用安全性高的 HTTPS API，可客製化各種情境操作，並具備多元化的通知方式，ItemHub 讓你專注在智慧裝置的運用，從今天開始你的智慧生活',
            image: `${APP_CONFIG.FRONT_END_URL}/assets/images/share.png`,
            keywords: 'ItemHub,item-hub,物聯網,iot,串聯裝置,連結裝置,low-code,no-code,iot platform,iot,internet of thing,iot data center'
        };
        await super.render({
        });
    }
}
