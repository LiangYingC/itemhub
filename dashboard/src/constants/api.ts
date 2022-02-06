export const API_PATH_PREFIX = import.meta.env.VITE_API_PATH_URL;

export const END_POINT = {
    SIGN_WITH_EMAIL: 'auth/sign-in-with-email',
    IS_SIGNED: 'auth/is-sign-in',
    DEVICES: 'me/devices',
    DEVICE: 'me/devices/:id',
    DEVICE_PINS: 'me/devices/:id/pins',
};

export const RESPONSE_STATUS = {
    OK: 'OK',
    FAILED: 'FAILED',
};
