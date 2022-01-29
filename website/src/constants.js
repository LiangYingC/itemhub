import { APP_CONFIG } from './config.js';

export const RESPONSE_STATUS = {
    OK: 'OK',
    FAILED: 'FAILED'
};

export const API = {
    SEND_VERIFY_EMAIL: 'auth/send-verify-email',
    VERIFY_EMAIL: 'auth/verify-email',
    SIGN_UP: 'auth/sign-up',
    SIGN_IN_WITH_EMAIL: 'auth/sign-in-with-email',
    SIGN_IN_WITH_SOCIAL_MEDIA: 'auth/sign-in-with-social-media',
    AUTH_WITH_SOCIAL_MEDIA: 'auth/auth-with-social-media',
    UNIVERSAL_SOCIAL_MEDIA_TYPE: 'universal/social-media-types',
    UNIVERSAL_PRICING_PLANS: 'universal/pricing-plans',
    NUMBER_OF_REGISTERED_USERS: 'users/number-of-registered-users',
    CHECKOUT: 'checkout',
    CHECK_IN: 'users/check-in'
};

export const OAUTH_TYPE = {
    SIGN_UP: 'sign-up',
    SIGN_IN: 'sign-in',
    CONNECT: 'connect'
};

export const OAUTH_PROVIDER = {
    FACEBOOK: 'facebook',
    GOOGLE: 'google',
    LINE: 'line'
};

export const THIRD_PARTY_KEY = {
    FB_CLIENT_ID: APP_CONFIG.FB_CLIENT_ID,
    GOOGLE_CLIENT_ID: APP_CONFIG.GOOGLE_CLIENT_ID,
    LINE_CLIENT_ID: APP_CONFIG.LINE_CLIENT_ID
};

export const EVENTS = {
    SIGN_UP: 'SIGN_UP',
    SIGN_OUT: 'SIGN_OUT',
    SIGN_IN: 'SIGN_IN'
};
