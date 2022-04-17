import { useEffect } from 'react';
import debounce from 'lodash.debounce';

/**
 * Hook that handle clicks outside of the passed elementRef
 * Reference: https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
 */
const useClickOutsideElement = ({
    elementRef,
    handleClick,
}: {
    elementRef: React.RefObject<HTMLElement>;
    handleClick: () => void;
}) => {
    const handleClickOutside = debounce((e) => {
        const element = elementRef.current;
        if (element && !element.contains(e.target) && handleClick) {
            handleClick();
        }
    }, 150);

    useEffect(() => {
        if (handleClickOutside) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [handleClickOutside]);
};

export default useClickOutsideElement;
