import {
    BaseComponent
} from '../../swim/base.component.js';

export class CooperationComponent extends BaseComponent {
    constructor (elRoot, variable, args) {
        super(elRoot, variable, args);
        this.id = 'CooperationComponent';
    }

    async render () {
        await super.render({
            ...this.variable
        });
    }

    async sendCooperationMessage () {
        console.log('sendCooperationMessage');
    }
}
