import FontAwesomeV6Icon from '@code-dot-org/component-library/fontAwesomeV6Icon';
import TextField, {
  TextFieldProps,
} from '@code-dot-org/component-library/textField';
import {SessionToken} from '@mapbox/search-js-core';
import {useAddressAutofillCore} from '@mapbox/search-js-react';
import classNames from 'classnames';
import React, {
  ChangeEvent,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {useSelector} from 'react-redux';

import {useDebounce} from '@cdo/apps/util/hooks/useDebounce';
import useOutsideClick from '@cdo/apps/util/hooks/useOutsideClick';

import styles from '../styles.module.scss';

export const AddressLookupInput = memo(
  ({
    label,
    name,
    size,
    className,
    onChange,
    value,
    errorMessage,
    debounceDelay = 300,
  }: {
    label: string;
    name: string;
    size: TextFieldProps['size'];
    className: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    value: string;
    errorMessage?: string;
    debounceDelay?: number;
  }) => {
    const sessionToken = useRef<SessionToken>(new SessionToken());
    const skipApi = useRef(true);
    const listboxId = sessionToken.current.id;
    const [suggestionResults, setSuggestionResults] = useState<string[]>([]);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [loading, setLoading] = useState(false);
    const accessToken = useSelector(
      ({mapbox: {mapboxAccessToken}}: {mapbox: {mapboxAccessToken: string}}) =>
        mapboxAccessToken
    );
    const autofill = useAddressAutofillCore({accessToken});
    const debouncedValue = useDebounce(value, debounceDelay);

    const reset = useCallback(() => {
      // reset is called on every click outside of the input
      // check for the need to reset component before changing state
      if (!suggestionResults.length) return;
      setSuggestionResults([]);
      setActiveIndex(-1);
    }, [suggestionResults]);

    const containerRef = useOutsideClick<HTMLDivElement>(reset);

    useEffect(() => {
      if (!accessToken) {
        return;
      }
      // skip api call when component first mounts if value already exists
      // also skip when a suggestion is selected and value updates with full address
      if (skipApi.current) {
        skipApi.current = false;
        return;
      }
      if (debouncedValue && debouncedValue.length >= 3) {
        const fetchSuggestions = async () => {
          try {
            setLoading(true);
            const {suggestions} = await autofill.suggest(debouncedValue, {
              sessionToken: sessionToken.current,
            });
            const fullAddresses = suggestions
              .map(suggestion => suggestion.full_address)
              .filter(
                (s?: string): s is string =>
                  typeof s === 'string' && s.length > 0
              );
            if (fullAddresses.includes(debouncedValue)) {
              setSuggestionResults([]);
            } else {
              setSuggestionResults(fullAddresses);
              setActiveIndex(-1);
            }
          } catch (error) {
            console.error(error);
          } finally {
            setLoading(false);
          }
        };
        fetchSuggestions();
      }
    }, [debouncedValue, autofill, accessToken]);

    const handleSelectSuggestion = useCallback(
      (suggestion: string) => {
        skipApi.current = true;
        onChange({
          target: {
            name,
            value: suggestion,
          },
        } as ChangeEvent<HTMLInputElement>);
        reset();
        containerRef.current?.querySelector('input')?.focus();
      },
      [containerRef, name, onChange, reset]
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
          case ' ':
            if (activeIndex >= 0) {
              // Add a check to ensure an item is actually highlighted
              e.preventDefault(); // Prevent the default action (change event)
              handleSelectSuggestion(suggestionResults[activeIndex]);
            }
            break;
          case 'Escape':
          case 'Tab':
            reset();
            break;
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
        <FontAwesomeV6Icon
          iconName={loading ? 'spinner' : 'magnifying-glass'}
          animationType={loading ? 'spin' : undefined}
          aria-hidden={true}
        />
        {suggestionResults.length > 0 && (
          <ul
            id={listboxId}
            role="listbox"
            className={classNames(styles.suggestionList, {
              [styles.keyboardNav]: activeIndex >= 0,
            })}
          >
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
  }
);
