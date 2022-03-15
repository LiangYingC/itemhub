import { SubscriptionDataService } from '../dataservices/subscription.dataservice.js';
import { RESPONSE_STATUS } from '../constants.js';
import { Toaster } from '../util/toaster.js';
import {
    RoutingController
} from '../swim/routing-controller.js';

export class MeController extends RoutingController {
    static get id () {
        return 'MeController';
    }

    async render () {
        const currentSubscription = this.args.currentSubscription || {};
        const pricingPlan = this.args.currentSubscription ? this.args.pricingPlans.find(item => item.value === this.args.currentSubscription.pricingPlan) : null;
        await super.render({
            name: this.args.me.name,
            ...currentSubscription,
            pricingPlanLabel: pricingPlan ? pricingPlan.label : '目前無訂閱方案',
            hasSubscribed: this.args.currentSubscription ? '' : 'd-none'
        });
    }

    async exit (args) {
        return super.exit(args);
    }

    async cancelSubscription () {
        if (!confirm('你真的要取消訂閱嗎？')) {
            return;
        }
        const resp = await SubscriptionDataService.Cancel({
            token: this.args.token
        });

        if (resp.status !== RESPONSE_STATUS.OK) {
            Toaster.popup(Toaster.TYPE.ERROR, resp.data.message);
            return;
        }
        Toaster.popup(Toaster.TYPE.INFO, 'ItemHub 已通知管理員, 將於月底協助你退款, 希望未來後會有期.');
        this.pageVariable.hasSubscribed = 'd-none';
        this.pageVariable.pricingPlanLabel = '目前無訂閱方案';
    }
}
