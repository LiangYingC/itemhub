import { Link } from 'react-router-dom';
import styles from './header.module.scss';

const Header = () => {
    // 如果展開 menu 的話，要在 styles.header 同一層 加 open 的 class
    // styles.hamburger , styles.space 點擊要可以關閉 menu
    return (
        <div
            className={`${styles.header} ${styles.open} position-relative bg-white flex-shrink-0`}
            data-testid="Header"
        >
            <div className={`${styles.menu} d-flex align-items-start`}>
                <div
                    className={
                        styles.space + ' position-absolute bg-black-opacity-65'
                    }
                />
                <div
                    className={styles.nav + ' flex-shrink-0 position-relative'}
                >
                    <div className="py-4 px-3">
                        <div className="d-flex justify-content-between align-items-center mt-2 px-3">
                            <a
                                href="/"
                                className={
                                    styles.logo + ' d-flex align-items-center'
                                }
                            >
                                <img
                                    className="icon"
                                    src="src/assets/images/logo.svg"
                                />
                                <img
                                    className={styles.text + ' ms-3 logo-text'}
                                    src="src/assets/images/logo-wording.svg"
                                />
                            </a>

                            <div
                                role="button"
                                className={styles.hamburger + ' p-2'}
                            >
                                <div className="bg-white w-100 rounded-pill" />
                                <div className="bg-white w-100 rounded-pill" />
                                <div className="bg-white w-100 rounded-pill" />
                            </div>
                        </div>
                    </div>
                    <div className={styles.item + ' px-3 '}>
                        <div className="py-2">
                            <Link
                                to="/dashboard/"
                                className="d-flex align-items-center text-white p-3 rounded-2"
                            >
                                <img
                                    className=""
                                    src="src/assets/images/icon-dashboard.svg"
                                />
                                <span className="lh-1 ps-2">Dashboard</span>
                            </Link>
                            <Link
                                to="/dashboard/triggers"
                                className="d-flex align-items-center text-white p-3"
                            >
                                <img
                                    className=""
                                    src="src/assets/images/icon-trigger.svg"
                                />
                                <span className="lh-1 ps-2">Trigger</span>
                            </Link>
                            <Link
                                to="/dashboard/oauth-clients"
                                className="d-flex align-items-center text-white p-3"
                            >
                                <img
                                    className=""
                                    src="src/assets/images/icon-oauthClient.svg"
                                />
                                <span className="lh-1 ps-2">oAuthClient</span>
                            </Link>
                            <Link
                                to="/dashboard/devices"
                                className="d-flex align-items-center text-white p-3"
                            >
                                <img
                                    className=""
                                    src="src/assets/images/icon-device.svg"
                                />
                                <span className="lh-1 ps-2">Device</span>
                            </Link>
                        </div>
                    </div>
                    <div className="position-absolute bottom-0 end-0 w-100">
                        <div className={styles.user + ' text-white p-3'}>
                            <div className="p-3">UserName</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
