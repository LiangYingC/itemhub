import { RESPONSE_STATUS } from '../../constants.js';
import { UserDataService } from '../../dataservices/user.dataservice.js';
import {
    BaseComponent
} from '../../swim/base.component.js';

export class PricingPlanComponent extends BaseComponent {
    constructor (elRoot, variable, args) {
        super(elRoot, variable, args);
        this.id = 'PricingPlanComponent';
    }

    async render () {
        await super.render({
            ...this.variable,
            numOfRegisteredUser: 0
        });
        UserDataService.GetNumberOfRegisteredUsers().then(resp => {
            if (resp.status === RESPONSE_STATUS.OK) {
                this.args.numOfRegisteredUser = resp.data.nums;
            }
        });
    }

    async postRender () {
        await super.postRender();
        document.body.addEventListener('CONTEXT_NUM_OF_REGISTERED_USER_CHANGED', (event) => {
            this.variable.numOfRegisteredUser = event.detail.newValue;
        });
    }

    computed () {
        return [{
            watchKey: 'numOfRegisteredUser',
            variableName: 'numberOfPromotedUser',
            value: () => {
                return this.variable.numOfRegisteredUser && this.variable.numOfRegisteredUser > 300 ? 0 : 300 - this.variable.numOfRegisteredUser;
            }
        }];
    }
}
