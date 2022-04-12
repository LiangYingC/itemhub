import {
    RoutingController
} from '../swim/routing-controller.js';
import { Toaster } from '../util/toaster.js';
import { CookieUtil } from '../util/cookie.js';
import { SubscriptionDataService } from '../dataservices/subscription.dataservice.js';
import { RESPONSE_STATUS } from '../constants.js';
import { CUSTOM_ERROR_TYPE } from '../util/custom-error.js';
import { UniversalDataService } from '../dataservices/universal.dataservice.js';

export class MasterController extends RoutingController {
    constructor (elHTML, parentController, args, context) {
        super(elHTML, parentController, args, context);
        this.Toaster = Toaster;
    }

    static get id () {
        return 'MasterController';
    }

    async render () {
        const overSubscriptionPlanVisible = this.args.me.isOverSubscriptionPlan && CookieUtil.getCookie('cancelOverSubscriptionPlan') !== 'true' ? '' : 'd-none';

        await super.render({
            ...this.args.me,
            user: this.args.me,
            overSubscriptionPlanVisible: overSubscriptionPlanVisible
        });
    }

    hideOverSubscriptionBanner () {
        CookieUtil.setCookie('cancelOverSubscriptionPlan', 'true');
        this.pageVariable.overSubscriptionPlanVisible = 'd-none';
    }

    async jumpToNextPlan (e) {
        const elButton = e.currentTarget;
        elButton.setAttribute('disabled', 'disabled');
        const token = CookieUtil.getCookie('token');
        const resp = await SubscriptionDataService.GetMyCurrentSubscription({
            token
        });
        const pricingPlans = (await UniversalDataService.GetPricingPlan()).data;
        elButton.removeAttribute('disabled');
        if (resp.status !== RESPONSE_STATUS.OK && resp.data.errorKey !== CUSTOM_ERROR_TYPE.NO_SUBSCRIPTION) {
            Toaster.popup(Toaster.TYPE.ERROR, resp.data.message);
        } else if (resp.status !== RESPONSE_STATUS.OK && resp.data.errorKey === CUSTOM_ERROR_TYPE.NO_SUBSCRIPTION) {
            history.pushState({}, '', '/checkout/?pricingPlan=0');
        } else if (resp.data.pricingPlan >= pricingPlans[pricingPlans.length - 1].value) {
            Toaster.popup(Toaster.TYPE.ERROR, '目前訂閱方案是最高的使用量, 如果需要更高的使用量請洽詢 itemhub.tw@gmail.com, 我們將提供客製化服務');
        } else {
            history.pushState({}, '', `/checkout/?pricingPlan=${resp.data.pricingPlan + 1}`);
        }
        CookieUtil.setCookie('cancelOverSubscriptionPlan', 'true');
        this.pageVariable.overSubscriptionPlanVisible = 'd-none';
    }
}
