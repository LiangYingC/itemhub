// import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hook';
import { menuActions, selectMenu } from '@/redux/reducers/menu.reducer';

const PageTitle = (props: {
    title: string;
    primaryButtonVisible?: boolean;
    secondaryButtonVisible?: boolean;
    primaryButtonWording?: string;
    secondaryButtonWording?: string;
    primaryButtonCallback?: () => void;
    secondaryButtonCallback?: () => void;
    primaryButtonIcon?: string;
    primaryButtonClassName?: string;
}) => {
    const {
        title,
        primaryButtonVisible,
        secondaryButtonVisible,
        primaryButtonCallback,
        primaryButtonWording,
        secondaryButtonCallback,
        secondaryButtonWording,
        primaryButtonIcon,
        primaryButtonClassName,
    } = props;
    const isOpen = useAppSelector(selectMenu).menu.isOpen;
    const dispatch = useAppDispatch();

    const openMenu = () => {
        dispatch(menuActions.open());
    };

    return (
        <div className="page-title" data-testid="page-title">
            <div className="w-100 d-flex align-items-center bg-white p-4">
                <div
                    role="button"
                    className={`hamburger p-2 ${isOpen ? 'd-none' : ''}`}
                    onClick={openMenu}
                >
                    <div className="bg-black bg-opacity-85 w-100 rounded-pill" />
                    <div className="bg-black bg-opacity-85 w-100 rounded-pill" />
                    <div className="bg-black bg-opacity-85 w-100 rounded-pill" />
                </div>
                <div className="flex-fill">
                    <div className="d-flex align-items-center justify-content-between">
                        <h3 className="mb-0">{title}</h3>
                        <div className="d-flex">
                            <button
                                onClick={primaryButtonCallback}
                                className={`${
                                    primaryButtonVisible ? '' : 'd-none'
                                } ${
                                    primaryButtonClassName || 'bg-light'
                                } d-flex align-items-center btn border border-secondary rounded-pill px-3 py-2`}
                            >
                                <img
                                    className="icon pe-2"
                                    src={
                                        primaryButtonIcon ||
                                        '/src/assets/images/icon-refresh.svg'
                                    }
                                />
                                <div className="lh-1 py-1">
                                    {primaryButtonWording}
                                </div>
                            </button>
                            <button
                                onClick={secondaryButtonCallback}
                                className={`${
                                    secondaryButtonVisible ? '' : 'd-none'
                                } d-flex align-items-center btn bg-primary text-white border border--primary rounded-pill ms-3  px-3 py-2`}
                            >
                                <img
                                    className="icon pe-2"
                                    src="/src/assets/images/icon-plus.svg"
                                />
                                <div className="lh-1 py-1">
                                    {secondaryButtonWording}
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageTitle;
