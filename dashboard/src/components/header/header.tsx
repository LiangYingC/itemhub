import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/hooks/redux.hook';
import { menuActions, selectMenu } from '@/redux/reducers/menu.reducer';
import triggerIcon from '@/assets/images/trigger.svg';
import dashboardIcon from '@/assets/images/dashboard.svg';
import deviceIcon from '@/assets/images/device.svg';
import oAuthClientIcon from '@/assets/images/oauth-client.svg';
import logoIcon from '@/assets/images/logo.svg';
import logoWordingIcon from '@/assets/images/logo-wording.svg';
import closeIcon from '@/assets/images/icon-close.svg';

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
            className={`${isOpen ? 'open' : ''} flex-shrink-0 header`}
            data-testid="Header"
        >
            <div>
                <div className="d-md-none bg-grey-800 p-4 top-nav position-relative">
                    <div className="d-flex align-items-center px-2">
                        <div
                            role="button"
                            className="hamburger p-2 me-3"
                            onClick={openMenu}
                        >
                            <div className="bg-white w-100 rounded-pill" />
                            <div className="bg-white w-100 rounded-pill" />
                            <div className="bg-white w-100 rounded-pill" />
                        </div>
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
                    </div>
                </div>
            </div>
            <div className="menu d-flex align-items-start sticky-md-top">
                <div
                    className="space position-absolute bg-black bg-opacity-65 d-md-none"
                    onClick={closeMenu}
                />
                <div className="head-nav flex-shrink-0 position-relative bg-grey-800">
                    <div className="d-flex align-items-center logo-block">
                        <Link to="/dashboard/" className="text-block">
                            <div className="d-flex align-items-center logo">
                                <img className="w-100 h-100" src={logoIcon} />
                                <img
                                    className="ms-25 logo-text"
                                    src={logoWordingIcon}
                                />
                            </div>
                        </Link>

                        <div
                            role="button"
                            className="hamburger p-2 hamburger-close"
                            onClick={closeMenu}
                        >
                            <div className="bg-white w-100 rounded-pill" />
                            <div className="bg-white w-100 rounded-pill" />
                            <div className="bg-white w-100 rounded-pill" />
                        </div>
                        <div
                            role="button"
                            className="hamburger p-2 hamburger-open"
                            onClick={openMenu}
                        >
                            <div className="bg-white w-100 rounded-pill" />
                            <div className="bg-white w-100 rounded-pill" />
                            <div className="bg-white w-100 rounded-pill" />
                        </div>
                        <div
                            role="button"
                            className="d-block d-md-none icon-close p-2"
                            onClick={closeMenu}
                        >
                            <img src={closeIcon} alt="close" className="" />
                        </div>
                    </div>
                    <div className="item-block py-2">
                        <Link
                            to="/dashboard/"
                            className="d-flex align-items-center text-white text-opacity-85 rounded-1 px-3 py-2 mb-2 item"
                        >
                            <img className="" src={dashboardIcon} />
                            <span className="text-block">
                                <div>監控中心</div>
                            </span>
                        </Link>
                        <Link
                            to="/dashboard/devices"
                            className="d-flex align-items-center text-white text-opacity-85 rounded-1 px-3 py-2 mb-2 item"
                        >
                            <img className="" src={deviceIcon} />
                            <span className="text-block">裝置</span>
                        </Link>

                        <Link
                            to="/dashboard/triggers"
                            className="d-flex align-items-center text-white text-opacity-85 rounded-1 px-3 py-2 mb-2 item"
                        >
                            <img className="" src={triggerIcon} />
                            <span className="text-block">觸發</span>
                        </Link>
                        <Link
                            to="/dashboard/oauth-clients"
                            className="d-flex align-items-center text-white text-opacity-85 rounded-1 px-3 py-2 mb-2 item"
                        >
                            <img className="" src={oAuthClientIcon} />
                            <span className="text-block">oAuthClient</span>
                        </Link>
                    </div>
                    <div className="position-absolute bottom-0 end-0 w-100">
                        <div className="border-top border-white border-opacity-15 text-white text-opacity-85">
                            <div className="d-flex align-items-center user-block p-3 mb-2">
                                <div className="text-block">UserName</div>
                                <div className="bg-primary p-3 rounded-circle" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
