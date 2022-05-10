import { useState, useRef } from 'react';
import debounce from 'lodash.debounce';

const AutocompletedSearch = ({
    datalistId,
    placeholder,
    currentValue,
    updateCurrentValue,
    allSuggestions,
}: {
    datalistId: string;
    placeholder: string;
    currentValue: string;
    updateCurrentValue: (newValue: string) => void;
    allSuggestions: string[];
}) => {
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>(
        []
    );
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);

    const inputRef = useRef<HTMLInputElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleChangeValue = (currentValue: string) => {
        const newFilteredOptions = allSuggestions.filter(
            (suggestion) =>
                suggestion
                    .toLowerCase()
                    .indexOf(currentValue.toString().toLowerCase()) > -1
        );
        setActiveSuggestionIndex(0);
        setFilteredSuggestions(newFilteredOptions);
        updateCurrentValue(currentValue);
    };
    const handleChangeValueWithDebounce = debounce(handleChangeValue, 300);

    const handleClickSuggestion = (e: React.MouseEvent<HTMLElement>) => {
        const target = e.target as HTMLElement;
        const currentValue = target.innerText;
        if (inputRef.current) {
            inputRef.current.value = currentValue;
        }
        updateCurrentValue(currentValue);
        setActiveSuggestionIndex(0);
        setFilteredSuggestions([]);
    };

    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const currentValue = filteredSuggestions[activeSuggestionIndex];
            if (inputRef.current && currentValue) {
                inputRef.current.value = currentValue;
                updateCurrentValue(currentValue);
                setActiveSuggestionIndex(0);
            }
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

    return (
        <div ref={wrapperRef}>
            <input
                className="form-control"
                list={datalistId}
                placeholder={placeholder}
                ref={inputRef}
                defaultValue={currentValue}
                onFocus={() =>
                    handleChangeValueWithDebounce(inputRef.current?.value || '')
                }
                onChange={() =>
                    handleChangeValueWithDebounce(inputRef.current?.value || '')
                }
                onKeyUp={handleKeyUp}
            />
            <datalist id={datalistId}>
                {filteredSuggestions.map((suggestion, index) => {
                    let className;
                    if (index === activeSuggestionIndex) {
                        className = 'active-suggestion';
                    }
                    return (
                        <option
                            key={suggestion}
                            className={className}
                            onClick={handleClickSuggestion}
                        >
                            {suggestion}
                        </option>
                    );
                })}
            </datalist>
        </div>
    );
};
export default AutocompletedSearch;
