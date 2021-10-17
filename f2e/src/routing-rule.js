import { AuthController } from './controllers/auth.controller.js';
import { CooperationController } from './controllers/cooperation.controller.js';
import { MainController } from './controllers/main.controller.js';
import { MasterController } from './controllers/master.controller.js';
import { MeController } from './controllers/me.controller.js';
import { PricingController } from './controllers/pricing.controller.js';
import { PrivacyPolicyController } from './controllers/privacy-policy.controller.js';
import { SignOutController } from './controllers/sign-out.controller.js';
import { UniversalDataService } from './dataservices/universal.dataservice.js';
import { SignUpRoutingRule } from './routing-rules/sign-up.routing-rule.js';
import { CookieUtil } from './util/cookie.js';

export const RoutingRule = [{
    path: '/auth/?state&code',
    controller: AuthController,
    html: '/template/auth.html',
    prepareData: [{
        key: 'state',
        func: (args) => {
            if (args.state.startsWith('line')) {
                const states = args.state.split(',');
                return {
                    provider: states[0],
                    type: states[1]
                };
            } else {
                return JSON.parse(args.state);
            }
        }
    }, {
        key: 'universal',
        func: async () => {
            return (await UniversalDataService.GetAll()).data;
        }
    }]
}, {
    path: '/sign-out/',
    controller: SignOutController
}, {
    path: '',
    prepareData: [{
        key: 'token',
        func: () => {
            return CookieUtil.getCookie('token');
        }
    }],
    dependency: [{
        url: '/third-party/jwt-decode.min.js',
        checkVariable: 'jwt_decode'
    }],
    controller: MainController,
    children: [{
        path: '/',
        controller: MasterController,
        html: '/template/master.html',
        prepareData: [{
            key: 'name',
            func: (args) => {
                if (!args.token) {
                    return '';
                }
                const extra = window.jwt_decode(args.token).extra;
                return `${extra.LastName}${extra.FirstName}`;
            }
        }, {
            key: 'email',
            func: (args) => {
                if (!args.token) {
                    return '';
                }
                const extra = window.jwt_decode(args.token).extra;
                return extra.Email;
            }
        }],
        children: [{
            path: 'pricing/',
            controller: PricingController,
            html: '/template/pricing.html'
        }, {
            path: 'cooperation/',
            controller: CooperationController,
            html: '/template/cooperation.html'
        }, {
            path: 'privacy-policy/',
            controller: PrivacyPolicyController,
            html: '/template/privacy-policy.html'
        }, {
            path: 'me/',
            controller: MeController,
            html: '/template/me.html',
            prepareData: [{
                key: 'name',
                func: (args) => {
                    const extra = window.jwt_decode(args.token).extra;
                    return `${extra.LastName}${extra.FirstName}`;
                }
            }]
        }, SignUpRoutingRule]
    }]
}];
