/* Auto Generate */
// command line `node build-cache.js`
import {
    FooterComponent
} from '../components/footer/footer.component.js';
import FooterHTML from '../components/footer/footer.html';
import '../components/footer/footer.scss';
import {
    HeaderComponent
} from '../components/header/header.component.js';
import HeaderHTML from '../components/header/header.html';
import '../components/header/header.scss';
import authHTML from '../template/auth.html';import cooperationHTML from '../template/cooperation.html';import masterHTML from '../template/master.html';import meHTML from '../template/me.html';import pricingHTML from '../template/pricing.html';import sendVerifyEmailHTML from '../template/send-verify-email.html';import signInHTML from '../template/sign-in.html';import signUpHTML from '../template/sign-up.html';import verifyEmailHTML from '../template/verify-email.html';import '../css/common.css';import '../css/cooperation.css';import '../css/master.css';import '../css/pricing.css';import '../css/common.scss';import '../css/cooperation.scss';import '../css/master.scss';import '../css/pricing.scss';import { APP_CONFIG } from '../config.js';
export const Cacher = {
    buildCache: () => {
        window.APP_CONFIG = APP_CONFIG;
        window.SwimAppComponents = window.SwimAppComponents || [];
        window.SwimAppLoaderCache = window.SwimAppLoaderCache || [];
        window.SwimAppStylesheet.push(`${APP_CONFIG.FRONT_END_PREFIX}/components/footer/footer.css`);        window.SwimAppComponents.FooterComponent = FooterComponent;        window.SwimAppLoaderCache[`${APP_CONFIG.FRONT_END_PREFIX}/components/footer/footer.html`] = FooterHTML;        window.SwimAppStylesheet.push(`${APP_CONFIG.FRONT_END_PREFIX}/components/header/header.css`);        window.SwimAppComponents.HeaderComponent = HeaderComponent;        window.SwimAppLoaderCache[`${APP_CONFIG.FRONT_END_PREFIX}/components/header/header.html`] = HeaderHTML;        window.SwimAppLoaderCache[`${APP_CONFIG.FRONT_END_PREFIX}/template/auth.html`] = authHTML;        window.SwimAppLoaderCache[`${APP_CONFIG.FRONT_END_PREFIX}/template/cooperation.html`] = cooperationHTML;        window.SwimAppLoaderCache[`${APP_CONFIG.FRONT_END_PREFIX}/template/master.html`] = masterHTML;        window.SwimAppLoaderCache[`${APP_CONFIG.FRONT_END_PREFIX}/template/me.html`] = meHTML;        window.SwimAppLoaderCache[`${APP_CONFIG.FRONT_END_PREFIX}/template/pricing.html`] = pricingHTML;        window.SwimAppLoaderCache[`${APP_CONFIG.FRONT_END_PREFIX}/template/send-verify-email.html`] = sendVerifyEmailHTML;        window.SwimAppLoaderCache[`${APP_CONFIG.FRONT_END_PREFIX}/template/sign-in.html`] = signInHTML;        window.SwimAppLoaderCache[`${APP_CONFIG.FRONT_END_PREFIX}/template/sign-up.html`] = signUpHTML;        window.SwimAppLoaderCache[`${APP_CONFIG.FRONT_END_PREFIX}/template/verify-email.html`] = verifyEmailHTML;        window.SwimAppStylesheet.push(`${APP_CONFIG.FRONT_END_PREFIX}/css/common.css`);        window.SwimAppStylesheet.push(`${APP_CONFIG.FRONT_END_PREFIX}/css/cooperation.css`);        window.SwimAppStylesheet.push(`${APP_CONFIG.FRONT_END_PREFIX}/css/master.css`);        window.SwimAppStylesheet.push(`${APP_CONFIG.FRONT_END_PREFIX}/css/pricing.css`);        window.SwimAppStylesheet.push(`${APP_CONFIG.FRONT_END_PREFIX}/css/common.css`);        window.SwimAppStylesheet.push(`${APP_CONFIG.FRONT_END_PREFIX}/css/cooperation.css`);        window.SwimAppStylesheet.push(`${APP_CONFIG.FRONT_END_PREFIX}/css/master.css`);        window.SwimAppStylesheet.push(`${APP_CONFIG.FRONT_END_PREFIX}/css/pricing.css`);
    }
}