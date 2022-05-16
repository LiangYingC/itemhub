const OnlineSatusTag = ({ isOnline }: { isOnline: boolean }) => {
    return (
        <div className={`tag fs-5 ${isOnline ? 'tag-green' : 'tag-grey'}`}>
            <div>{isOnline ? '上線' : '離線'}</div>
        </div>
    );
};

export default OnlineSatusTag;
