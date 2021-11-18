import { APP_CONFIG } from './config.js';
import { AuthController } from './controllers/auth.controller.js';
import { CooperationController } from './controllers/cooperation.controller.js';
import { MainController } from './controllers/main.controller.js';
import { MasterController } from './controllers/master.controller.js';
import { MeController } from './controllers/me.controller.js';
import { PricingController } from './controllers/pricing.controller.js';
import { PrivacyPolicyController } from './controllers/privacy-policy.controller.js';
import { SignInController } from './controllers/sign-in.controller.js';
import { SignOutController } from './controllers/sign-out.controller.js';
import { UniversalDataService } from './dataservices/universal.dataservice.js';
import { UserDataService } from './dataservices/user.dataservice.js';
import { SignUpRoutingRule } from './routing-rules/sign-up.routing-rule.js';
import { CookieUtil } from './util/cookie.js';

const gTag = {
    dependency: {
        url: `https://www.googletagmanager.com/gtag/js?id=${APP_CONFIG.GA_PROPERTY_ID}`,
        checkVariable: 'dataLayer'
    },
    prepareData: {
        key: 'gtag',
        func: () => {
            window.dataLayer = window.dataLayer || [];
            if (!window.gtag) {
                function gtag () {
                    window.dataLayer.push(arguments);
                }
                gtag('js', new Date());
                gtag('config', APP_CONFIG.GA_PROPERTY_ID);
                window.gtag = gtag;
            }

            return window.gtag;
        }
    }
};

export const RoutingRule = [{
    path: '/auth/?state&code',
    controller: AuthController,
    html: '/template/auth.html',
    dependency: [{
        url: `https://www.googletagmanager.com/gtag/js?id=${APP_CONFIG.GA_PROPERTY_ID}`,
        checkVariable: 'dataLayer'
    }, gTag.dependency],
    prepareData: [gTag.prepareData, {
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
    controller: SignOutController,
    dependency: [gTag.dependency],
    prepareData: [gTag.prepareData]
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
    }, gTag.dependency],
    controller: MainController,
    children: [{
        path: '/',
        controller: MasterController,
        html: '/template/master.html',
        prepareData: [{
            key: 'me',
            func: (args) => {
                if (!args.token) {
                    return {
                        name: '',
                        email: ''
                    };
                }
                const extra = window.jwt_decode(args.token).extra;
                return {
                    name: `${extra.LastName}${extra.FirstName}`,
                    email: extra.Email
                };
            }
        }, {
            key: 'numberOfRegisteredUsers',
            func: async () => {
                const resp = await UserDataService.GetNumberOfRegisteredUsers();
                return resp.data.nums;
            }
        }, gTag.prepareData],
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
        }, {
            path: 'sign-in/',
            controller: SignInController,
            html: '/template/sign-in.html'
        }, SignUpRoutingRule]
    }]
}];
