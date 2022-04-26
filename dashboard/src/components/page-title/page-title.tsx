import { useAppDispatch, useAppSelector } from '@/hooks/redux.hook';
import { menuActions, selectMenu } from '@/redux/reducers/menu.reducer';
import refreshIcon from '/src/assets/images/icon-refresh.svg';
import plusIcon from '/src/assets/images/icon-plus.svg';
import leftArrowIcon from '/src/assets/images/left-arrow.svg';

const PageTitle = (props: {
    title: string;
    titleClickCallback?: () => void;
    titleBackIconVisible?: boolean;
    primaryButtonVisible?: boolean;
    secondaryButtonVisible?: boolean;
    primaryButtonWording?: string;
    secondaryButtonWording?: string;
    primaryButtonCallback?: () => void;
    secondaryButtonCallback?: () => void;
    primaryButtonIcon?: string;
    primaryButtonClassName?: string;
    secondaryButtonClassName?: string;
    secondaryButtonIcon?: string;
}) => {
    const {
        title,
        titleClickCallback,
        titleBackIconVisible,
        primaryButtonVisible,
        secondaryButtonVisible,
        primaryButtonCallback,
        primaryButtonWording,
        secondaryButtonCallback,
        secondaryButtonWording,
        primaryButtonIcon,
        primaryButtonClassName,
        secondaryButtonClassName,
        secondaryButtonIcon,
    } = props;
    const isOpen = useAppSelector(selectMenu).menu.isOpen;
    const dispatch = useAppDispatch();

    const openMenu = () => {
        dispatch(menuActions.open());
    };

    return (
        <div className="page-title" data-testid="page-title">
            <div className="w-100 d-flex align-items-center px-45 pt-4">
                <div
                    role="button"
                    className={`d-none hamburger p-2 me-3 ${
                        isOpen ? 'd-none' : 'd-md-block'
                    }`}
                    onClick={openMenu}
                >
                    <div className="bg-black bg-opacity-85 w-100 rounded-pill" />
                    <div className="bg-black bg-opacity-85 w-100 rounded-pill" />
                    <div className="bg-black bg-opacity-85 w-100 rounded-pill" />
                </div>
                <div className="flex-fill">
                    <div className="d-flex align-items-center justify-content-between flex-wrap mb-45">
                        <h3
                            role={titleClickCallback ? 'button' : ''}
                            onClick={titleClickCallback}
                            className="text-break text-black text-opacity-85 mb-0"
                        >
                            <img
                                className={`icon me-2 ${
                                    titleBackIconVisible ? '' : 'd-none'
                                }`}
                                src={leftArrowIcon}
                            />
                            {title}
                        </h3>

                        <div className="d-flex">
                            <button
                                onClick={secondaryButtonCallback}
                                className={`${
                                    secondaryButtonVisible ? ' me-3' : 'd-none'
                                } ${
                                    secondaryButtonClassName ||
                                    'btn btn-secondary'
                                } `}
                            >
                                <img
                                    className="icon"
                                    src={secondaryButtonIcon || refreshIcon}
                                />
                                <div>{secondaryButtonWording}</div>
                            </button>
                            <button
                                onClick={primaryButtonCallback}
                                className={`${
                                    primaryButtonVisible ? '' : 'd-none'
                                } ${
                                    primaryButtonClassName || 'btn btn-primary'
                                } `}
                            >
                                <img
                                    className="icon"
                                    src={primaryButtonIcon || plusIcon}
                                />
                                <div>{primaryButtonWording}</div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageTitle;
