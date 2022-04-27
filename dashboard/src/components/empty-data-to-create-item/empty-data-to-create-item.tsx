import { useNavigate } from 'react-router-dom';
import emptyImage from '@/assets/images/empty-image.svg';
import plusIcon from '@/assets/images/icon-plus.svg';

const EmptyDataToCreateItem = ({ itemName }: { itemName: string }) => {
    const navigate = useNavigate();
    const jumpToCreatePage = () => {
        navigate('create');
    };

    return (
        <div className="d-block p-6 text-center">
            <img src={emptyImage} alt="empty image" />
            <div className="mt-2">{`尚未建立任何${itemName}, 點擊按鈕開始新增吧！`}</div>
            <button
                onClick={jumpToCreatePage}
                className="d-flex align-items-center btn bg-light-blue text-white border border-light-blue rounded-pill mx-auto mt-3 px-3 py-2"
            >
                <img className="icon pe-2" src={plusIcon} />
                <div className="lh-1 py-1 fw-bold">{`新增${itemName}`}</div>
            </button>
        </div>
    );
};

export default EmptyDataToCreateItem;
