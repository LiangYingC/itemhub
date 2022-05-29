import { useState, useEffect, useRef } from 'react';
import debounce from 'lodash.debounce';

const AutocompletedSearch = ({
    isDisabled = false,
    isError = false,
    errorMessage = '請輸入正確的內容',
    datalistId,
    placeholder,
    allSuggestions,
    currentValue,
    updateCurrentValue,
    onEnterKeyUp,
    onClickOption,
}: {
    isDisabled?: boolean;
    isError?: boolean;
    errorMessage?: string;
    datalistId: string;
    placeholder: string;
    allSuggestions: string[];
    currentValue: string;
    updateCurrentValue: (newValue: string) => void;
    onEnterKeyUp?: () => void;
    onClickOption?: () => void;
}) => {
    const [filteredSuggestions, setFilteredSuggestions] =
        useState<string[]>(allSuggestions);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);

    const inputRef = useRef<HTMLInputElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const isTriggerOnClickOption = useRef(false);
    const [isTriggerOnEnterKeyUp, setIsTriggerOnEnterKeyUp] = useState(false);

    useEffect(() => {
        if (isTriggerOnClickOption.current && onClickOption) {
            onClickOption();
            isTriggerOnClickOption.current = false;
        }
    }, [currentValue, onClickOption]);

    useEffect(() => {
        if (isTriggerOnEnterKeyUp && onEnterKeyUp) {
            onEnterKeyUp();
            setIsTriggerOnEnterKeyUp(false);
        }
    }, [currentValue, isTriggerOnEnterKeyUp, onEnterKeyUp]);

    useEffect(() => {
        setFilteredSuggestions(allSuggestions);
    }, [allSuggestions]);

    const handleChangeValue = ({
        currentValue,
        nativeEvent,
    }: {
        currentValue: string;
        nativeEvent: InputEvent;
    }) => {
        const isClickOption = !('inputType' in nativeEvent);
        if (isClickOption) {
            isTriggerOnClickOption.current = true;
        }

        const newFilteredOptions = allSuggestions.filter((suggestion) => {
            return (
                suggestion
                    .toLowerCase()
                    .indexOf(currentValue.toString().toLowerCase()) > -1
            );
        });
        setActiveSuggestionIndex(0);
        setFilteredSuggestions(newFilteredOptions);
        updateCurrentValue(currentValue);
    };
    const handleChangeValueWithDebounce = debounce(handleChangeValue, 300);

    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const currentValue = filteredSuggestions[activeSuggestionIndex];
            if (inputRef.current?.value && currentValue) {
                inputRef.current.value = currentValue;
                updateCurrentValue(currentValue);
                setActiveSuggestionIndex(0);
            }
            if (onEnterKeyUp) {
                setIsTriggerOnEnterKeyUp(true);
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
                className={`form-control ${isError && 'border-danger'}`}
                list={datalistId}
                placeholder={placeholder}
                ref={inputRef}
                disabled={isDisabled}
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
                        <option
                            key={`${suggestion}-${index}`}
                            className={className}
                        >
                            {suggestion}
                        </option>
                    );
                })}
            </datalist>
            {isError && (
                <div className="text-danger mt-1 fs-5">{errorMessage}</div>
            )}
        </div>
    );
};
export default AutocompletedSearch;
