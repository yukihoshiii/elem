import { forwardRef, useState } from 'react';
import classNames from 'classnames';
import handleSmartInput from '../../Utils/handleSmartInput';

type TextareaProps = {
    placeholder?: string;
    className?: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onInput?: (event: React.FormEvent<HTMLTextAreaElement>) => void;
    maxLength?: number;
};

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ placeholder, className, value = '', onChange, onInput, maxLength }, ref) => {
        const [internalValue, setInternalValue] = useState(value);

        const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
            handleSmartInput(e, (newValue) => {
                setInternalValue(newValue);
                if (onChange) {
                    const syntheticEvent = {
                        ...e,
                        target: { ...e.target, value: newValue },
                    } as React.ChangeEvent<HTMLTextAreaElement>;
                    onChange(syntheticEvent);
                }
            });

            if (onInput) onInput(e);
        };

        return (
            <textarea
                placeholder={placeholder}
                className={classNames('UI-Input', className)}
                value={value ?? internalValue}
                onInput={handleInput}
                maxLength={maxLength}
                ref={ref}
            />
        );
    }
);

export default Textarea;
