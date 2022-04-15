import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/hooks/redux.hook';
import { menuActions, selectMenu } from '@/redux/reducers/menu.reducer';

const Header = () => {
    const isOpen = useAppSelector(selectMenu).menu.isOpen;
    const dispatch = useAppDispatch();

    const closeMenu = () => {
        dispatch(menuActions.close());
    };

    return (
        <div
            className={`${
                isOpen ? 'open' : ''
            } position-relative bg-white flex-shrink-0 header`}
            data-testid="Header"
        >
            <div className="menu d-flex align-items-start">
                <div className="space position-absolute bg-black bg-opacity-65 d-md-none" />
                <div className="head-nav flex-shrink-0 position-relative">
                    <div className="overflow-hidden logo-block py-4 px-3">
                        <div className="d-flex justify-content-between align-items-center px-3 ">
                            <Link
                                to="/dashboard/"
                                className="logo d-flex align-items-center"
                            >
                                <img
                                    className="icon"
                                    src="/src/assets/images/logo.svg"
                                />
                                <img
                                    className="text ms-25 logo-text"
                                    src="/src/assets/images/logo-wording.svg"
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
                    <div className="item px-3 ">
                        <div className="py-2">
                            <Link
                                to="/dashboard/"
                                className="d-flex align-items-center text-white text-opacity-85 text-decoration-none p-3"
                            >
                                <img
                                    className=""
                                    src="/src/assets/images/icon-dashboard.svg"
                                />
                                <span className="lh-1 ps-25">監控中心</span>
                            </Link>
                            <Link
                                to="/dashboard/devices"
                                className="d-flex align-items-center text-white text-opacity-85 text-decoration-none p-3"
                            >
                                <img
                                    className=""
                                    src="/src/assets/images/icon-device.svg"
                                />
                                <span className="lh-1 ps-25">裝置</span>
                            </Link>

                            <Link
                                to="/dashboard/triggers"
                                className="d-flex align-items-center text-white text-opacity-85 text-decoration-none p-3"
                            >
                                <img
                                    className=""
                                    src="/src/assets/images/icon-trigger.svg"
                                />
                                <span className="lh-1 ps-25">觸發</span>
                            </Link>
                            <Link
                                to="/dashboard/oauth-clients"
                                className="d-flex align-items-center text-white text-opacity-85 text-decoration-none p-3"
                            >
                                <img
                                    className=""
                                    src="/src/assets/images/icon-oauthClient.svg"
                                />
                                <span className="lh-1 ps-25">oAuthClient</span>
                            </Link>
                        </div>
                    </div>
                    <div className="position-absolute bottom-0 end-0 w-100">
                        <div className="user text-white text-opacity-85 p-3">
                            <div className="p-3">UserName</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
