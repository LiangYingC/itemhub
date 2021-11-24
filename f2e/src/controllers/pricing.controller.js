import {
    RoutingController
} from '../swim/routing-controller.js';

export class PricingController extends RoutingController {
    static get id () {
        return 'PricingController';
    }

    async render () {
        this.meta = {
            title: '方案 - ItemHub'
        };
        await super.render({
            numOfRegisteredUser: this.args.numOfRegisteredUser
        });
    }

    async postRender () {
        await super.postRender();
        document.body.addEventListener('CONTEXT_NUM_OF_REGISTERED_USER_CHANGED', (event) => {
            this.pageVariable.numOfRegisteredUser = event.detail.newValue;
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
