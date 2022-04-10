import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './header.module.scss';

const Header = () => {
    const [value, setValue] = useState<string>('');

    const toggleSwitch = () => {
        setValue(value === 'isOpen' ? '' : 'isOpen');
    };

    return (
        <div
            className={styles.header + ' position-relative w-100 bg-white'}
            data-testid="Header"
        >
            <div className={styles.menu + ' d-flex align-items-start '}>
                <div className={value === 'isOpen' ? styles.open : ''}>
                    <div
                        className={styles.space + ' position-absolute'}
                        onClick={toggleSwitch}
                    />
                    <div
                        className={
                            styles.nav +
                            ' flex-shrink-0 position-relative opacity-10'
                        }
                    >
                        <div className="py-4 px-3">
                            <div className="d-flex justify-content-between align-items-center mt-2 px-3">
                                <a
                                    href="/"
                                    className={
                                        styles.logo +
                                        ' d-flex align-items-center'
                                    }
                                >
                                    <img
                                        className="icon"
                                        src="src/assets/images/logo.svg"
                                    />
                                    <img
                                        className={
                                            styles.text + ' ms-3 logo-text'
                                        }
                                        src="src/assets/images/logo-wording.svg"
                                    />
                                </a>

                                <div
                                    role="button"
                                    onClick={toggleSwitch}
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
                                    <span className="lh-1 ps-2">
                                        oAuthClient
                                    </span>
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
                <div
                    className={
                        styles.topAttr +
                        ' w-100 d-flex align-items-center bg-white p-4'
                    }
                >
                    <div
                        onClick={toggleSwitch}
                        role="button"
                        className={styles.hamburger + ' p-2'}
                    >
                        <div className="bg-black bg-opacity-85 w-100 rounded-pill" />
                        <div className="bg-black bg-opacity-85 w-100 rounded-pill" />
                        <div className="bg-black bg-opacity-85 w-100 rounded-pill" />
                    </div>
                    <div className="flex-fill">
                        <div className="d-flex align-items-center justify-content-between">
                            <h3 className="mb-0 bg-black-opacity-85">
                                頁面標題
                            </h3>
                            <div className="d-flex">
                                <a
                                    href=""
                                    className="d-flex align-items-center btn bg-light border border-secondary rounded-pill px-3 py-2"
                                >
                                    <img
                                        className="icon pe-2"
                                        src="src/assets/images/icon-refresh.svg"
                                    />
                                    重新整理
                                </a>
                                <a
                                    href=""
                                    className="d-flex align-items-center btn bg-primary text-white border border--primary rounded-pill ms-3  px-3 py-2"
                                >
                                    <img
                                        className="icon pe-2"
                                        src="src/assets/images/icon-plus.svg"
                                    />
                                    新增裝置
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
