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
            ...this.variable
        });
    }
}
