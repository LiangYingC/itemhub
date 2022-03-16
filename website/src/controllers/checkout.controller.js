import { APP_CONFIG } from '../config.js';
import { CheckoutDataService } from '../dataservices/checkout.dataservice.js';
import { CookieUtil } from '../util/cookie.js';
import {
    RoutingController
} from '../swim/routing-controller.js';
import { INVOICE_TYPES, RESPONSE_STATUS } from '../constants.js';
import { Toaster } from '../util/toaster.js';
import { Swissknife } from '../util/swissknife.js';

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
            Toaster.popup(Toaster.TYPE.INFO, '請先登入在訂閱服務');
            history.replaceState({}, '', '/auth/sign-in/');
            return;
        }

        const selectedPricingPlan = this.args.pricingPlans.find(item => item.value === Number(this.args.pricingPlan));
        if (!selectedPricingPlan) {
            history.replaceState({}, '', '/pricing/');
            return;
        }

        this.args.pricingPlans.forEach((item) => {
            item.price = Swissknife.convertNumberWithComma(item.price);
        });

        await super.render({
            pricingPlans: this.args.pricingPlans,
            invoiceTypes: 0,
            universalInvoiceTypes: this.args.invoiceTypes,
            selectedPricingPlan: selectedPricingPlan,
            selectedPricingPlanName: selectedPricingPlan.label,
            selectedPricingPlanPrice: selectedPricingPlan.price
        });

        this.elHTML.querySelectorAll('[name="pricing"]').forEach((item) => {
            if (Number(item.value) === selectedPricingPlan.value) {
                item.setAttribute('checked', 'checked');
            }
        });
    }

    async postRender () {
        await super.postRender();

        window.TPDirect.setupSDK('123053', 'app_TqsnC7DDhb2B1J4kT89cO71uJRhfpkNC6c6TgphTYdgBG4IO6BzanakHWgn3', APP_CONFIG.ENV === 'dev' ? 'sandbox' : 'production');
        window.TPDirect.card.setup({
            fields: {
                number: {
                    element: '.card-number',
                    placeholder: '請輸入信用卡卡號'
                },
                expirationDate: {
                    element: '.expiration',
                    placeholder: 'MM / YY'
                },
                ccv: {
                    element: '.ccv',
                    placeholder: '請輸入後三碼'
                }
            },
            styles: {
                input: {
                    'font-size': '16px',
                    'line-height': '1em',
                    'background-color': '#fff',
                    color: 'rgba(0, 0, 0, 0.85)'
                }
            }
        });
    }

    async checkout (event) {
        event.preventDefault();
        const selectedPricingPlan = this.elHTML.querySelector('[name="pricing"]:checked').value;
        if (selectedPricingPlan === null || selectedPricingPlan === undefined) {
            Toaster.popup(Toaster.TYPE.ERROR, '訂閱失敗: 無方案資料');
        }

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

        location.href = resp.data.paymentUrl;
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

    showTripleInvoiceDetail (event) {
        const tripleInvoice = this.args.invoiceTypes.find(type => type.key === INVOICE_TYPES.TRIPLE_INVOICE);
        if (Number(event.target.value) === tripleInvoice.value) {
            this.elHTML.querySelector('.triple-invoice-detail').removeClass('d-none');
        } else {
            this.elHTML.querySelector('.triple-invoice-detail').addClass('d-none');
        }
    }

    changeUrlPricingPlanValue () {
        const path = `/checkout/?pricingPlan=${this.elHTML.querySelector('[name="pricing"]:checked').value}`;
        history.replaceState({}, '', path);
    }
}
