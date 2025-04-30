import FontAwesomeV6Icon from '@code-dot-org/component-library/fontAwesomeV6Icon';
import TextField, {
  TextFieldProps,
} from '@code-dot-org/component-library/textField';
import {SessionToken} from '@mapbox/search-js-core';
import {useAddressAutofillCore} from '@mapbox/search-js-react';
import classNames from 'classnames';
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {useSelector} from 'react-redux';

import {useDebounce} from '@cdo/apps/util/hooks/useDebounce';
import useOutsideClick from '@cdo/apps/util/hooks/useOutsideClick';

import styles from '../styles.module.scss';

export const AddressLookupInput = ({
  label,
  name,
  size,
  className,
  onChange,
  value,
  errorMessage,
}: {
  label: string;
  name: string;
  size: TextFieldProps['size'];
  className: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  value: string;
  errorMessage?: string;
}) => {
  const sessionToken = useRef<SessionToken>(new SessionToken());
  const listboxId = sessionToken.current.id;
  const [suggestionResults, setSuggestionResults] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const accessToken = useSelector(
    ({mapbox: {mapboxAccessToken}}: {mapbox: {mapboxAccessToken: string}}) =>
      mapboxAccessToken
  );
  const autofill = useAddressAutofillCore({accessToken});
  const debouncedValue = useDebounce(value, 300);

  const reset = () => {
    setSuggestionResults([]);
    setActiveIndex(-1);
  };

  const containerRef = useOutsideClick<HTMLDivElement>(reset);

  useEffect(() => {
    if (debouncedValue) {
      (async () => {
        const {suggestions} = await autofill.suggest(debouncedValue, {
          sessionToken: sessionToken.current,
        });
        const fullAddresses = suggestions
          .map(suggestion => suggestion.full_address)
          .filter(
            (s?: string): s is string => typeof s === 'string' && s.length > 0
          );
        if (fullAddresses.includes(debouncedValue)) {
          setSuggestionResults([]);
        } else {
          setSuggestionResults(fullAddresses);
          setActiveIndex(-1);
        }
      })();
    }
  }, [debouncedValue, autofill]);

  const handleSelectSuggestion = useCallback(
    (suggestion: string) => {
      console.log(suggestion);
      onChange({
        target: {
          name,
          value: suggestion,
        },
      } as ChangeEvent<HTMLInputElement>);
      reset();
      containerRef.current?.querySelector('input')?.focus();
    },
    [containerRef, name, onChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestionResults.length > 0) {
      const {key} = e;
      switch (key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex(prev =>
            Math.min(prev + 1, suggestionResults.length - 1)
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
        case 'Space':
          handleSelectSuggestion(suggestionResults[activeIndex]);
          break;
        case 'Escape':
        case 'Tab':
          reset();
      }
    }
  };

  return (
    <div ref={containerRef} className={styles.locationAddressContainer}>
      <TextField
        name={name}
        label={label}
        size={size}
        onChange={onChange}
        value={value}
        className={className}
        errorMessage={errorMessage}
        placeholder="Enter a location to see results"
        onKeyDown={handleKeyDown}
        autoComplete="off"
        role="combobox"
        aria-autocomplete="list"
        aria-controls={listboxId}
        aria-expanded={suggestionResults.length > 0}
        aria-activedescendant={
          activeIndex >= 0 ? `${listboxId}-item-${activeIndex}` : undefined
        }
      />
      <FontAwesomeV6Icon iconName="magnifying-glass" aria-hidden={true} />
      {suggestionResults.length > 0 && (
        <ul id={listboxId} role="listbox" className={styles.suggestionList}>
          {suggestionResults.map((suggestion, index) => (
            <li
              key={suggestion}
              className={classNames(styles.suggestionItem, {
                [styles.active]: activeIndex === index,
              })}
              onClick={() => handleSelectSuggestion(suggestion)}
              id={`${listboxId}-item-${index}`}
              role="option"
              aria-selected={activeIndex === index}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
