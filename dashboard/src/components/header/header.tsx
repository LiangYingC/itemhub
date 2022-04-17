import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/hooks/redux.hook';
import { menuActions, selectMenu } from '@/redux/reducers/menu.reducer';
import triggerIcon from '@/assets/images/trigger.svg';
import dashboardIcon from '@/assets/images/dashboard.svg';
import deviceIcon from '@/assets/images/device.svg';
import oAuthClientIcon from '@/assets/images/oauth-client.svg';
import logoIcon from '@/assets/images/logo.svg';
import logoWordingIcon from '@/assets/images/logo-wording.svg';

const Header = () => {
    const isOpen = useAppSelector(selectMenu).menu.isOpen;
    const dispatch = useAppDispatch();

    const closeMenu = () => {
        dispatch(menuActions.close());
    };

    const openMenu = () => {
        dispatch(menuActions.open());
    };

    return (
        <div
            className={`${
                isOpen ? 'open' : ''
            } position-relative flex-shrink-0 header`}
            data-testid="Header"
        >
            <div>
                <div className="d-md-none bg-grey-800 py-4 px-3">
                    <div className="d-flex justify-content-between align-items-center px-3 ">
                        <Link
                            to="/dashboard/"
                            className="logo d-flex align-items-center"
                        >
                            <img className="icon w-100 h-100" src={logoIcon} />
                            <img
                                className="ms-25 logo-text"
                                src={logoWordingIcon}
                            />
                        </Link>

                        <div
                            role="button"
                            className="hamburger p-2"
                            onClick={openMenu}
                        >
                            <div className="bg-white w-100 rounded-pill" />
                            <div className="bg-white w-100 rounded-pill" />
                            <div className="bg-white w-100 rounded-pill" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="menu d-flex align-items-start">
                <div
                    className="space position-absolute bg-black bg-opacity-65 d-md-none"
                    onClick={closeMenu}
                />
                <div className="head-nav flex-shrink-0 position-relative bg-grey-800">
                    <div className="d-flex d-md-none justify-content-end m-3 close">
                        <div
                            role="button"
                            className="position-relative p-2 icon"
                            onClick={closeMenu}
                        >
                            <div className="border border-white border-1 w-100 position-absolute top-50 start-0 rounded-pill" />
                            <div className="border border-white border-1 w-100 position-absolute top-50 end-0 rounded-pill" />
                        </div>
                    </div>
                    <div className="d-none d-md-block overflow-hidden logo-block py-4 px-3">
                        <div className="d-flex justify-content-between align-items-center px-3 ">
                            <Link
                                to="/dashboard/"
                                className="logo d-flex align-items-center"
                            >
                                <img
                                    className="w-100 h-100 icon"
                                    src={logoIcon}
                                />
                                <img
                                    className="ms-25 logo-text"
                                    src={logoWordingIcon}
                                />
                            </Link>

                            <div
                                role="button"
                                className="hamburger p-2"
                                onClick={closeMenu}
                            >
                                <div className="bg-white w-100 rounded-pill" />
                                <div className="bg-white w-100 rounded-pill" />
                                <div className="bg-white w-100 rounded-pill" />
                            </div>
                        </div>
                    </div>
                    <div className="item px-3">
                        <div className="py-2">
                            <Link
                                to="/dashboard/"
                                className="d-flex align-items-center text-white text-opacity-85 text-decoration-none p-3"
                            >
                                <img className="" src={dashboardIcon} />
                                <span className="lh-1 ps-25">監控中心</span>
                            </Link>
                            <Link
                                to="/dashboard/devices"
                                className="d-flex align-items-center text-white text-opacity-85 text-decoration-none p-3"
                            >
                                <img className="" src={deviceIcon} />
                                <span className="lh-1 ps-25">裝置</span>
                            </Link>

                            <Link
                                to="/dashboard/triggers"
                                className="d-flex align-items-center text-white text-opacity-85 text-decoration-none p-3"
                            >
                                <img className="" src={triggerIcon} />
                                <span className="lh-1 ps-25">觸發</span>
                            </Link>
                            <Link
                                to="/dashboard/oauth-clients"
                                className="d-flex align-items-center text-white text-opacity-85 text-decoration-none p-3"
                            >
                                <img className="" src={oAuthClientIcon} />
                                <span className="lh-1 ps-25">oAuthClient</span>
                            </Link>
                        </div>
                    </div>
                    <div className="position-absolute bottom-0 end-0 w-100">
                        <div className="border-top border-white border-opacity-15 text-white text-opacity-85 p-3">
                            <div className="p-3">UserName</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
