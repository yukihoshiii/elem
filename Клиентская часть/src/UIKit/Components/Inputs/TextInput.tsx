import { forwardRef, useState, FormEvent, ClipboardEvent, useCallback, memo } from 'react';
import classNames from 'classnames';
import handleSmartInput from '../../Utils/handleSmartInput';

interface TextInputProps {
  value?: string;
  placeholder?: string;
  className?: string;
  maxLength?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  type?: string;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  onPaste?: (e: ClipboardEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
}

const TextInput = memo(forwardRef<HTMLInputElement, TextInputProps>(
  ({ value, placeholder, className, maxLength, onChange, name, type, onKeyDown, onPaste, readOnly }, ref) => {
    const [internalValue, setInternalValue] = useState(value || '');

    const handleInput = useCallback((e: FormEvent<HTMLInputElement>) => {
      handleSmartInput(e, (newValue: string) => {
        setInternalValue(newValue);
        if (onChange) {
          const syntheticEvent = {
            ...e,
            target: { ...e.target, value: newValue }
          } as React.ChangeEvent<HTMLInputElement>;
          onChange(syntheticEvent);
        }
      });
    }, [onChange]);

    const handlePaste = useCallback((e: ClipboardEvent<HTMLInputElement>) => {
      if (onPaste) {
        onPaste(e);
      }
    }, [onPaste]);

    return (
      <input
        value={value ?? internalValue}
        placeholder={placeholder}
        type={type ?? 'text'}
        className={classNames('UI-Input', className)}
        autoComplete="off"
        maxLength={maxLength}
        name={name}
        ref={ref}
        onKeyDown={onKeyDown}
        onPaste={handlePaste}
        readOnly={readOnly}
        onInput={handleInput}
      />
    );
  }
));

export default TextInput;

