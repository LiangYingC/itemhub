export const API_URL = import.meta.env.VITE_API_URL;

export const END_POINT = {
    SIGN_WITH_EMAIL: 'auth/sign-in-with-email',
    IS_SIGNED: 'auth/is-sign-in',
    DEVICES: 'me/devices',
    DEVICE: 'me/devices/:id',
    DEVICE_PINS: 'me/devices/:id/pins',
    OAUTH_CLIENTS: 'me/oauth-clients',
    OAUTH_CLIENT: 'me/oauth-clients/:id',
    OAUTH_CLIENT_REVOKE_SECRET: 'me/oauth-clients/:id/revoke-secret',
    TRIGGERS: 'me/triggers',
    TRIGGER: 'me/triggers/:id',
};

export const HTTP_METHOD = {
    GET: 'GET',
    POST: 'POST',
    PATCH: 'PATCH',
    DELETE: 'DELETE',
};

export const RESPONSE_STATUS = {
    OK: 'OK',
    FAILED: 'FAILED',
};
