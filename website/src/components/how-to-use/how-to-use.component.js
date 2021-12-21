import {
    BaseComponent
} from '../../swim/base.component.js';

export class HowToUseComponent extends BaseComponent {
    constructor (elRoot, variable, args) {
        super(elRoot, variable, args);
        this.id = 'HowToUseComponent';
    }

    async render () {
        await super.render({
            ...this.variable
        });
    }
}
