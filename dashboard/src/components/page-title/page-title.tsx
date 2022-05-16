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
    thirdlyButtonVisible?: boolean;
    primaryButtonWording?: string;
    secondaryButtonWording?: string;
    thirdlyButtonWording?: string;
    primaryButtonCallback?: () => void;
    secondaryButtonCallback?: () => void;
    thirdlyButtonCallback?: () => void;
    primaryButtonIcon?: string;
    primaryButtonClassName?: string;
    secondaryButtonClassName?: string;
    secondaryButtonIcon?: string;
    thirdlyButtonIcon?: string;
    thirdlyButtonClassName?: string;
}) => {
    const {
        title,
        titleClickCallback,
        titleBackIconVisible,
        primaryButtonVisible,
        secondaryButtonVisible,
        thirdlyButtonVisible,
        primaryButtonCallback,
        primaryButtonWording,
        secondaryButtonCallback,
        secondaryButtonWording,
        thirdlyButtonCallback,
        thirdlyButtonWording,
        primaryButtonIcon,
        primaryButtonClassName,
        secondaryButtonClassName,
        secondaryButtonIcon,
        thirdlyButtonClassName,
        thirdlyButtonIcon,
    } = props;

    return (
        <div className="page-title" data-testid="page-title">
            <div className="w-100 px-45 pt-45 mb-45">
                <div className="flex-fill">
                    <div className="d-flex align-items-start justify-content-between flex-wrap">
                        <h3
                            role={titleClickCallback ? 'button' : ''}
                            onClick={titleClickCallback}
                            className="text-break text-black text-opacity-85 mb-3 mb-sm-0"
                        >
                            <img
                                className={`icon me-3 ${
                                    titleBackIconVisible ? '' : 'd-none'
                                }`}
                                src={leftArrowIcon}
                            />
                            {title}
                        </h3>

                        <div className="d-flex flex-wrap">
                            <button
                                onClick={thirdlyButtonCallback}
                                className={`mb-3 mb-sm-0 ${
                                    thirdlyButtonVisible ? ' me-3' : 'd-none'
                                } ${
                                    thirdlyButtonClassName ||
                                    'btn btn-secondary'
                                } `}
                            >
                                <img
                                    className="icon"
                                    src={thirdlyButtonIcon || refreshIcon}
                                />
                                <div>{thirdlyButtonWording}</div>
                            </button>
                            <button
                                onClick={secondaryButtonCallback}
                                className={`mb-3 mb-sm-0 ${
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
                                className={`mb-3 mb-sm-0 ${
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
