import { APP_CONFIG } from '../config.js';
import { RoutingController } from '../swim/routing-controller.js';
import { CookieUtil } from '../util/cookie.js';

export class PricingController extends RoutingController {
    static get id () {
        return 'PricingController';
    }

    async render () {
        this.meta = {
            title: '價格方案 - ItemHub',
            'og:title': '價格方案 - ItemHub',
            description: 'ItemHub 讓你輕鬆簡單連接裝置與感應器，從今天開始你的智慧生活',
            image: `${APP_CONFIG.FRONT_END_URL}/assets/images/share.png`,
            keywords: 'ItemHub,item-hub,物聯網,iot,串聯裝置,連結裝置'
        };
        await super.render({});
    }

    redirectToDashboard () {
        const dashboardToken = CookieUtil.getCookie('dashboardToken');
        const token = CookieUtil.getCookie('token');
        if (token && dashboardToken) {
            location.href = APP_CONFIG.DASHBOARD_URL;
        } else if (token && !dashboardToken) {
            history.pushState({}, '', '/auth/two-factor-auth/');
        } else if (!token) {
            history.replaceState({}, '', `/auth/sign-in/?redirectUrl=${encodeURIComponent('/auth/two-factor-auth/')}`);
        }
    }
}
