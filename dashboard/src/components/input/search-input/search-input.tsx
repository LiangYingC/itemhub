import { useRef } from 'react';
import searchIcon from '@/assets/images/icon-search.svg';
import debounce from 'lodash.debounce';

const SearchInput = ({
    placeholder,
    defaultValue = '',
    onChangeValue,
    onSearch,
}: {
    placeholder: string;
    defaultValue?: string;
    onChangeValue: (value: string) => void;
    onSearch: () => void;
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    let shouldBeTwiceEnter = false;
    let enterCount = 0;

    const searchInputKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.nativeEvent.isComposing) {
            shouldBeTwiceEnter = true;
        }

        if (e.code === 'Enter') {
            enterCount += 1;
        }

        if (
            (enterCount >= 2 && shouldBeTwiceEnter) ||
            (enterCount == 1 && !shouldBeTwiceEnter)
        ) {
            shouldBeTwiceEnter = false;
            enterCount = 0;
            onSearch();
        }
    };

    return (
        <div className="position-relative search-input">
            <input
                className="form-control border border-black border-opacity-15 rounded-start"
                type="text"
                ref={inputRef}
                placeholder={placeholder}
                defaultValue={defaultValue}
                onChange={debounce(
                    () => onChangeValue(inputRef.current?.value || ''),
                    300
                )}
                onKeyUp={searchInputKeyUp}
            />
            <button
                className="position-absolute top-0 end-0 btn d-inline-block shadow-none border-0 p-2"
                type="button"
                onClick={onSearch}
            >
                <img src={searchIcon} alt="icon-search" />
            </button>
        </div>
    );
};

export default SearchInput;
