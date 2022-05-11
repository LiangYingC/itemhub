import { useState, useRef } from 'react';
import debounce from 'lodash.debounce';

const AutocompletedSearch = ({
    datalistId,
    placeholder,
    allSuggestions,
    currentValue,
    updateCurrentValue,
    onEnterKeyUp,
    onClickOption,
}: {
    datalistId: string;
    placeholder: string;
    allSuggestions: string[];
    currentValue: string;
    updateCurrentValue: (newValue: string) => void;
    onEnterKeyUp?: () => void;
    onClickOption?: () => void;
}) => {
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>(
        []
    );
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);

    const inputRef = useRef<HTMLInputElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleChangeValue = ({
        currentValue,
        nativeEvent,
    }: {
        currentValue: string;
        nativeEvent: InputEvent;
    }) => {
        const newFilteredOptions = allSuggestions.filter(
            (suggestion) =>
                suggestion
                    .toLowerCase()
                    .indexOf(currentValue.toString().toLowerCase()) > -1
        );
        setActiveSuggestionIndex(0);
        setFilteredSuggestions(newFilteredOptions);
        updateCurrentValue(currentValue);

        const isClickOption = !('inputType' in nativeEvent);
        if (isClickOption && onClickOption) {
            onClickOption();
        }
    };
    const handleChangeValueWithDebounce = debounce(handleChangeValue, 300);

    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const currentValue = filteredSuggestions[activeSuggestionIndex];
            if (inputRef.current && currentValue) {
                inputRef.current.value = currentValue;
                updateCurrentValue(currentValue);
                setActiveSuggestionIndex(0);
            }
            if (onEnterKeyUp) {
                onEnterKeyUp();
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
                onKeyUp={handleKeyUp}
                onChange={(e) => {
                    const nativeEvent = e.nativeEvent as InputEvent;
                    handleChangeValueWithDebounce({
                        currentValue: inputRef.current?.value || '',
                        nativeEvent,
                    });
                }}
            />
            <datalist id={datalistId}>
                {filteredSuggestions.map((suggestion, index) => {
                    let className;
                    if (index === activeSuggestionIndex) {
                        className = 'active-suggestion';
                    }
                    return (
                        <option key={suggestion} className={className}>
                            {suggestion}
                        </option>
                    );
                })}
            </datalist>
        </div>
    );
};
export default AutocompletedSearch;
