import {
    RoutingController
} from '../swim/routing-controller.js';

export class MainController extends RoutingController {
    async render () {
        this.meta = {
            title: 'ItemHub',
            'og:title': 'Connect to the world',
            description: 'Let your device connect internet without coding, 無需撰寫程式讓你的裝置輕鬆連上物聯網',
            image: '',
            keywords: 'low-code,no-code,iot platform,iot,internet of thing,iot data center'
        };
        await super.render({
            ...this.args.me,
            numOfRegisteredUser: this.args.numOfRegisteredUser || 0,
            user: this.args.me
        });
    }
}
