import CloseButton from '@code-dot-org/component-library/closeButton';
import FontAwesomeV6Icon from '@code-dot-org/component-library/fontAwesomeV6Icon';
import FormFieldWrapper, {
  FormFieldWrapperProps,
} from '@code-dot-org/component-library/formFieldWrapper';
import Tags from '@code-dot-org/component-library/tags';
import {BodyThreeText} from '@code-dot-org/component-library/typography';
import classNames from 'classnames';
import React, {useState, useRef, useEffect, useCallback, useMemo} from 'react';

import useOutsideClick from '@cdo/apps/util/hooks/useOutsideClick';

import styles from './styles.module.scss';

export type OptionId = string | number;

export interface Option {
  id: OptionId;
  searchText: string[];
  label: string;
  secondaryLabel?: string;
}

export const MultiSelectInput: React.FC<{
  name: string;
  label: string;
  options: Option[];
  selectedOptions: OptionId[];
  setSelectedOptions: (selectedOptions: OptionId[]) => void;
  id?: string;
  size?: FormFieldWrapperProps['size'];
  className?: string;
  placeholder?: string;
  emptyStateMessage?: string;
  errorMessage?: string;
}> = ({
  name,
  label,
  options,
  selectedOptions,
  setSelectedOptions,
  errorMessage,
  size,
  className,
  id = 'multiselect',
  placeholder = 'Filter options',
  emptyStateMessage = 'No results found',
}) => {
  const [searchText, setSearchText] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [hoveredOptionId, setHoveredOptionId] = useState<OptionId | null>(null);

  const reset = () => {
    setMenuOpen(false);
    setSearchText('');
    setActiveIndex(-1);
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useOutsideClick<HTMLDivElement>(reset);
  const optionRefs = useRef<Map<OptionId, HTMLLIElement>>(new Map());

  const filteredOptions = useMemo(
    () =>
      options
        .filter(option =>
          option.searchText.some(text =>
            text.toLowerCase().includes(searchText.toLowerCase())
          )
        )
        .slice(0, 100), // Limiting to 100 options for performance
    [options, searchText]
  );

  const optionsMap = useMemo(
    () => new Map(options.map(option => [option.id, option])),
    [options]
  );

  const activeDescendant = useMemo(
    () =>
      activeIndex >= 0 && filteredOptions[activeIndex]
        ? `${id}-option-${filteredOptions[activeIndex].id}`
        : undefined,
    [activeIndex, filteredOptions, id]
  );

  // scrolls option into view
  // activeIndex is set when navigating the option menu
  // via keyboard interaction
  useEffect(() => {
    if (activeIndex >= 0 && filteredOptions[activeIndex] && menuOpen) {
      const activeElement = optionRefs.current.get(
        filteredOptions[activeIndex].id ?? ''
      );
      activeElement?.scrollIntoView({behavior: 'smooth', block: 'nearest'});
    }
  }, [activeIndex, filteredOptions, menuOpen]);

  useEffect(() => {
    if (activeIndex < 0 && searchText) {
      setActiveIndex(0);
    }
  }, [activeIndex, searchText]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = e.currentTarget;
    setSearchText(value);
    setActiveIndex(-1);
    if (!menuOpen && value) {
      setMenuOpen(true);
    }
    if (!value) {
      reset();
    }
  };

  const handleToggleOption = (optionId: OptionId) => {
    setSearchText('');
    setActiveIndex(-1);
    setSelectedOptions(
      selectedOptions.includes(optionId)
        ? selectedOptions.filter(id => id !== optionId)
        : [...selectedOptions, optionId]
    );
  };

  const handleRemoveOption = (optionId: OptionId) => {
    setSelectedOptions(selectedOptions.filter(id => id !== optionId));
  };

  const handleClearAll = () => {
    setSelectedOptions([]);
    reset();
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const {key} = e;

    // Open menu on ArrowDown/ArrowUp if closed and there are options
    if (!menuOpen && (key === 'ArrowDown' || key === 'ArrowUp')) {
      if (filteredOptions.length > 0) {
        e.preventDefault();
        setMenuOpen(true);
        if (key === 'ArrowDown') {
          setActiveIndex(0);
        } else {
          setActiveIndex(filteredOptions.length - 1);
        }
        return;
      }
    }

    // Handle navigation and selection if menu is open
    if (menuOpen) {
      switch (key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex(prev =>
            Math.min(prev + 1, filteredOptions.length - 1)
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
        case ' ':
          if (activeIndex >= 0 && filteredOptions[activeIndex]) {
            // Add a check to ensure an item is actually highlighted
            e.preventDefault(); // Prevent the default action (change event)
            handleToggleOption(filteredOptions[activeIndex].id);
          }
          break;
        case 'Escape':
          e.preventDefault();
          reset();
          break;
        case 'Tab':
          reset();
          break;
      }
    }

    if (key === 'Backspace' && searchText === '') {
      if (selectedOptions.length > 0) {
        handleRemoveOption(selectedOptions[selectedOptions.length - 1]);
      } else {
        reset();
      }
    }
  };

  const isOptionSelected = useCallback(
    (id: OptionId) => selectedOptions.includes(id),
    [selectedOptions]
  );

  const isOptionHovered = useCallback(
    (id: OptionId) => hoveredOptionId === id && activeIndex < 0,
    [hoveredOptionId, activeIndex]
  );

  const anyOptionsSelected = useMemo(
    () => selectedOptions.length > 0,
    [selectedOptions]
  );

  return (
    <div ref={wrapperRef}>
      <FormFieldWrapper
        label={label}
        className={classNames(styles.label, className)}
        id={`${id}-label`}
        size={size}
        errorMessage={errorMessage}
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          inputRef.current?.focus();
        }}
      >
        <div
          className={classNames(styles.container, {
            [styles.focused]: isFocused,
          })}
          aria-haspopup="listbox"
        >
          <div className={styles.tagsAndSearchContainer}>
            {selectedOptions.map(id => {
              const option = optionsMap.get(id);
              if (!option) {
                return null;
              }

              return (
                <Tags
                  key={id}
                  className={styles.tag}
                  size="s"
                  tagsList={[
                    {
                      label: option.label,
                      type: 'closable',
                      onClose: () => {
                        handleRemoveOption(option.id);
                      },
                      key: option.id,
                      ariaLabel: `Remove ${option.label}`,
                    },
                  ]}
                />
              );
            })}
            <input
              className={styles.searchInput}
              ref={inputRef}
              id={id}
              name={name}
              placeholder={placeholder}
              value={searchText}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onClick={() => setMenuOpen(true)}
              onKeyDown={handleInputKeyDown}
              role="combobox"
              aria-autocomplete="list"
              aria-controls={`${id}-listbox`}
              aria-expanded={menuOpen}
              aria-activedescendant={activeDescendant}
              aria-labelledby={`${id}-label`}
              autoComplete="new-password"
            />
          </div>
          {anyOptionsSelected && (
            <CloseButton
              className={styles.clearAllButton}
              onClick={handleClearAll}
              aria-label="Clear all selected options"
            />
          )}

          {menuOpen && (
            <ul
              className={classNames(styles.multiSelectMenu, {
                [styles.keyboardNav]: activeIndex >= 0,
              })}
              id={`${id}-listbox`}
              role="listbox"
              aria-multiselectable="true"
              aria-labelledby={`${id}-label`}
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, i) => {
                  const selected = isOptionSelected(option.id);
                  const optionFocused = activeIndex === i;
                  const optionHovered = isOptionHovered(option.id);
                  const optionHtmlId = `${id}-option-${option.id}`;

                  return (
                    <li
                      key={option.id}
                      id={optionHtmlId}
                      className={classNames(styles.option, {
                        [styles.focused]: optionFocused,
                      })}
                      onMouseDown={e => {
                        e.preventDefault();
                        handleToggleOption(option.id);
                        inputRef.current?.focus();
                      }}
                      onMouseEnter={() => setHoveredOptionId(option.id)}
                      onMouseLeave={() => setHoveredOptionId(null)}
                      role="option"
                      aria-selected={selected}
                      ref={el =>
                        el
                          ? optionRefs.current.set(option.id, el)
                          : optionRefs.current.delete(option.id)
                      }
                    >
                      <div className={styles.optionLabelText}>
                        <BodyThreeText>{option.label}</BodyThreeText>
                        {option.secondaryLabel && (
                          <BodyThreeText>{option.secondaryLabel}</BodyThreeText>
                        )}
                      </div>

                      {selected && (
                        <FontAwesomeV6Icon
                          iconName={
                            optionHovered || optionFocused ? 'close' : 'check'
                          }
                          aria-hidden
                        />
                      )}
                    </li>
                  );
                })
              ) : (
                <li>
                  <BodyThreeText className={styles.emptyState}>
                    {emptyStateMessage}
                  </BodyThreeText>
                </li>
              )}
            </ul>
          )}
        </div>
      </FormFieldWrapper>
    </div>
  );
};
