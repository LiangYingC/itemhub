import { APP_CONFIG } from '../config.js';
import { CheckoutDataService } from '../dataservices/checkout.dataservice.js';
import { CookieUtil } from '../util/cookie.js';
import {
    RoutingController
} from '../swim/routing-controller.js';
import { RESPONSE_STATUS } from '../constants.js';
import { Toaster } from '../util/toaster.js';

export class CheckoutController extends RoutingController {
    static get id () {
        return 'CheckoutController';
    }

    async render () {
        this.meta = {
            title: '訂閱 - ItemHub',
            'og:title': '訂閱 - ItemHub',
            description: '簡單三步驟輕鬆的串聯並操控各項裝置，採用安全性高的 HTTPS API，可客製化各種情境操作，並具備多元化的通知方式，ItemHub 讓你專注在智慧裝置的運用，從今天開始你的智慧生活',
            image: `${APP_CONFIG.FRONT_END_URL}/assets/images/share.png`,
            keywords: 'ItemHub,item-hub,物聯網,iot,串聯裝置,連結裝置,low-code,no-code,iot platform,iot,internet of thing,iot data center'
        };
        if (!this.args.me.id) {
            Toaster.popup(Toaster.TYPE.INFO, '請先登入再進入訂閱頁面');
            history.replaceState({}, '', '/sign-in/');
            return;
        }
        const selectedPricingPlan = this.args.pricingPlans.find(item => item.value === Number(this.args.pricingPlan));
        if (!selectedPricingPlan) {
            history.replaceState({}, '', '/pricing/');
            return;
        }
        await super.render({
            selectedPricingPlan: selectedPricingPlan,
            selectedPricingPlanName: selectedPricingPlan.label,
            selectedPricingPlanPrice: selectedPricingPlan.price
        });
    }

    async postRender () {
        await super.postRender();
        window.TPDirect.setupSDK('123053', 'app_TqsnC7DDhb2B1J4kT89cO71uJRhfpkNC6c6TgphTYdgBG4IO6BzanakHWgn3', APP_CONFIG.ENV === 'dev' ? 'sandbox' : 'production');
        window.TPDirect.card.setup({
            fields: {
                number: {
                    element: '.card-number',
                    placeholder: '**** **** **** ****'
                },
                expirationDate: {
                    element: '.expiration',
                    placeholder: 'MM / YY'
                },
                ccv: {
                    element: '.ccv',
                    placeholder: '後三碼'
                }
            },
            styles: {
                input: {
                    'font-size': '16px',
                    'line-height': '1em',
                    color: 'rgba(255, 255, 255, 0.85)'
                }
            }
        });
    }

    async checkout (event) {
        event.preventDefault();

        // 取得 TapPay Fields 的 status
        const tappayStatus = window.TPDirect.card.getTappayFieldsStatus();

        // 確認是否可以 getPrime
        if (tappayStatus.canGetPrime === false) {
            alert('can not get prime');
            return;
        }

        // Get prime
        const prime = await this.getPrime();
        const form = this.elHTML.querySelector('.checkout-form').collectFormData();
        const resp = await CheckoutDataService.Checkout({
            prime,
            ...form,
            token: CookieUtil.getCookie('token'),
            pricingPlan: this.pageVariable.selectedPricingPlan.value
        });
        if (resp.status !== RESPONSE_STATUS.OK) {
            Toaster.popup(Toaster.TYPE.ERROR, `訂閱失敗: ${resp.data.message}`);
            return;
        }

        Toaster.popup(Toaster.TYPE.INFO, `成功訂閱: 第一期依照使用期間計費共 NTD $${resp.data.amount}`);
    }

    async getPrime () {
        return new Promise((resolve, reject) => {
            window.TPDirect.card.getPrime((result) => {
                if (result.status !== 0) {
                    reject(new Error(`get prime error ${result.msg}`));
                }
                resolve(result.card.prime);
            });
        });
    }
}
