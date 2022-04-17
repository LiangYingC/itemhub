import { useState, useRef } from 'react';
import useClickOutsideElement from '@/hooks/clickOutsideElement.hook';

const AutocompletedSearch = ({
    currentValue,
    updateCurrentValue,
    allSuggestions,
}: {
    currentValue: string;
    updateCurrentValue: (newValue: string) => void;
    allSuggestions: string[];
}) => {
    const [isShowSuggestions, setIsShowSuggestions] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>(
        []
    );
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);

    const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const currentValue = e.target.value;
        const newFilteredOptions = allSuggestions.filter(
            (suggestion) =>
                suggestion.toLowerCase().indexOf(currentValue.toLowerCase()) >
                -1
        );
        setActiveSuggestionIndex(0);
        setFilteredSuggestions(newFilteredOptions);
        setIsShowSuggestions(true);
        updateCurrentValue(currentValue);
    };

    const handleClickSuggestion = (e: React.MouseEvent<HTMLElement>) => {
        const target = e.target as HTMLElement;
        updateCurrentValue(target.innerText);
        setActiveSuggestionIndex(0);
        setFilteredSuggestions([]);
        setIsShowSuggestions(false);
    };

    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            updateCurrentValue(filteredSuggestions[activeSuggestionIndex]);
            setActiveSuggestionIndex(0);
            setIsShowSuggestions(false);
        } else if (e.key === 'ArrowUp') {
            return activeSuggestionIndex === 0
                ? null
                : setActiveSuggestionIndex(activeSuggestionIndex - 1);
        } else if (e.key === 'ArrowDown') {
            return activeSuggestionIndex - 1 === filteredSuggestions.length
                ? null
                : setActiveSuggestionIndex(activeSuggestionIndex + 1);
        }
    };

    const autocompletedSearchRef = useRef<HTMLDivElement>(null);
    const handleClickOuside = () => {
        setIsShowSuggestions(false);
    };
    useClickOutsideElement({
        elementRef: autocompletedSearchRef,
        handleClick: handleClickOuside,
    });

    return (
        <div ref={autocompletedSearchRef}>
            <input
                className="form-control"
                value={currentValue}
                onFocus={handleChangeValue}
                onChange={handleChangeValue}
                onKeyUp={handleKeyUp}
            />
            {isShowSuggestions ? (
                filteredSuggestions.length > 0 ? (
                    <ul className="autocomplete-wrapper">
                        {filteredSuggestions.map((suggestion, index) => {
                            let className;
                            if (index === activeSuggestionIndex) {
                                className = 'active-suggestion';
                            }
                            return (
                                <li
                                    key={suggestion}
                                    className={className}
                                    onClick={handleClickSuggestion}
                                >
                                    {suggestion}
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <div className="no-suggestions">
                        <p>沒有資料，請重新搜尋</p>
                    </div>
                )
            ) : null}
        </div>
    );
};
export default AutocompletedSearch;
