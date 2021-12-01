import { RESPONSE_STATUS } from '../../constants.js';
import { AuthDataService } from '../../dataservices/auth.dataservice.js';
import {
    BaseComponent
} from '../../swim/base.component.js';
import { Toaster } from '../../util/toaster.js';

export class CheckInComponent extends BaseComponent {
    constructor (elRoot, variable, args) {
        super(elRoot, variable, args);
        this.id = 'CheckInComponent';
    }

    async render () {
        await super.render({
            ...this.variable
        });
    }

    async checkIn (event) {
        const elButton = event.currentTarget;
        elButton.setAttribute('disabeld', 'disabeld');
        const elForm = elButton.closest('.form');
        const data = elForm.collectFormData();

        if (!((/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(data.email)))) {
            Toaster.popup(Toaster.TYPE.ERROR, 'EMAIL格式不正確');
            return;
        }

        elButton.removeAttribute('disabled');
        const resp = await AuthDataService.CheckIn(data);
        if (resp.status !== RESPONSE_STATUS.OK) {
            Toaster.popup(Toaster.TYPE.ERROR, resp.data.message);
        }

        Toaster.popup(Toaster.TYPE.INFO, '登記成功');
    }
}
