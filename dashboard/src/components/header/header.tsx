import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/hooks/redux.hook';
import { menuActions, selectMenu } from '@/redux/reducers/menu.reducer';
import triggerIcon from '@/assets/images/trigger.svg';
import dashboardIcon from '@/assets/images/dashboard.svg';
import deviceIcon from '@/assets/images/device.svg';
import logoIcon from '@/assets/images/logo.svg';
import logoWordingIcon from '@/assets/images/logo-wording.svg';
import shieldIcon from '@/assets/images/shield.svg';

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
                !isOpen ? 'close' : ''
            } flex-shrink-0 header sticky-md-top align-items-start`}
            data-testid="Header"
        >
            <div className="logo-block d-flex align-items-center justify-content-between justify-content-md-center px-3">
                <Link to="/dashboard/">
                    <div className="logo align-items-center overflow-hidden d-flex flex-nowrap justify-content-center">
                        <img src={logoIcon} />
                        <img
                            className="ms-25 logo-text"
                            src={logoWordingIcon}
                        />
                    </div>
                </Link>

                <div
                    role="button"
                    className="hamburger p-2"
                    onClick={() => {
                        isOpen ? closeMenu() : openMenu();
                    }}
                >
                    <div className="bg-white w-100 rounded-pill" />
                    <div className="bg-white w-100 rounded-pill" />
                    <div className="bg-white w-100 rounded-pill" />
                </div>
            </div>
            <div className="menu-block py-2">
                <Link
                    to="/dashboard/"
                    className="nav-item d-flex align-items-center justify-content-start justify-content-md-center text-white text-opacity-85 rounded-1 py-2 px-3 my-2 mx-3"
                >
                    <img src={dashboardIcon} />
                    <span className="text-block text-nowrap overflow-hidden">
                        <div className="mx-3">監控中心</div>
                    </span>
                </Link>
                <Link
                    to="/dashboard/devices"
                    className="nav-item d-flex align-items-center justify-content-start justify-content-md-center text-white text-opacity-85 rounded-1 py-2 px-3 my-2 mx-3"
                >
                    <img src={deviceIcon} />
                    <span className="text-block text-nowrap overflow-hidden">
                        <div className="mx-3">裝置</div>
                    </span>
                </Link>

                <Link
                    to="/dashboard/triggers"
                    className="nav-item d-flex align-items-center justify-content-start justify-content-md-center text-white text-opacity-85 rounded-1 py-2 px-3 my-2 mx-3"
                >
                    <img src={triggerIcon} />
                    <span className="text-block text-nowrap overflow-hidden">
                        <div className="mx-3">觸發</div>
                    </span>
                </Link>
                <Link
                    to="/dashboard/oauth-clients"
                    className="nav-item d-flex align-items-center justify-content-start justify-content-md-center text-white text-opacity-85 rounded-1 py-2 px-3 my-2 mx-3"
                >
                    <img src={shieldIcon} />
                    <span className="text-block text-nowrap overflow-hidden">
                        <div className="mx-3">oAuthClient</div>
                    </span>
                </Link>
            </div>
            <div
                className={`space position-absolute bg-black bg-opacity-65 ${
                    isOpen ? 'd-md-none' : 'd-none'
                }`}
                onClick={closeMenu}
            />
        </div>
    );
};

export default Header;
