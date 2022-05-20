import { useRef } from 'react';
import closeIcon from '@/assets/images/dark-close.svg';

const TagInput = ({
    placeholder,
    tags = [],
    handleAddition,
    handleDelete,
}: {
    placeholder?: string;
    tags?: Tag[];
    handleAddition: (tag: Tag) => void;
    handleDelete: (id: string) => void;
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const handleKeyboardEvent = (event: React.KeyboardEvent) => {
        if (event.key === 'Tab' && event.type === 'keydown') {
            event.nativeEvent.stopPropagation();
            event.nativeEvent.preventDefault();
        }

        const { target } = event.nativeEvent as KeyboardEvent;
        const elInput = target as HTMLInputElement;

        if (
            event.key === 'Backspace' &&
            event.type === 'keydown' &&
            elInput.value === ''
        ) {
            handleDelete(tags[tags.length - 1].id);
        }

        if (
            (event.key === 'Enter' || event.key === 'Tab') &&
            event.type === 'keyup'
        ) {
            if (target === null) {
                return;
            }
            const newTag: Tag = {
                id: new Date().getTime().toString(),
                text: elInput.value,
            };

            if (inputRef.current) {
                inputRef.current.value = '';
            }

            handleAddition(newTag);
        }
    };

    return (
        <div className="tag-input d-flex flex-wrap my-n2">
            {tags.map((tag) => (
                <div
                    key={tag.id}
                    className="d-flex flex-nowrap align-items-center px-3 py-1 rounded-pill bg-grey-700 bg-opacity-25 mx-2 my-2"
                >
                    <span className={`${tag.className || ''} me-3`}>
                        {tag.text}
                    </span>
                    <img
                        role="button"
                        onClick={() => {
                            handleDelete(tag.id);
                        }}
                        src={closeIcon}
                    />
                </div>
            ))}

            <input
                ref={inputRef}
                type="text"
                className="border-0 outline"
                onKeyUp={handleKeyboardEvent}
                onKeyDown={handleKeyboardEvent}
                placeholder={placeholder}
            />
        </div>
    );
};

export default TagInput;

export interface Tag {
    id: string;
    text: string;
    className?: string;
}
