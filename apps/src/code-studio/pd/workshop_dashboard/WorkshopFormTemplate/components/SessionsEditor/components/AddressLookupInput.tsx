import FontAwesomeV6Icon from '@code-dot-org/component-library/fontAwesomeV6Icon';
import TextField, {
  TextFieldProps,
} from '@code-dot-org/component-library/textField';
import type {AddressAutofillRetrieveResponse} from '@mapbox/search-js-core';
import {AddressAutofill} from '@mapbox/search-js-react';
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {useSelector} from 'react-redux';

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
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const [fullAddress, setFullAddress] = useState<string | undefined>();
  const accessToken = useSelector(
    ({mapbox: {mapboxAccessToken}}: {mapbox: {mapboxAccessToken: string}}) =>
      mapboxAccessToken
  );

  /**
   * AddressAutofill uses form autoComplete to fill the input with the street
   * address but not the full address. This is a workaround to get the full address.
   * The AddressAutofill component will call the onRetrieve function with the
   * address response the user has selected from the dropdown. Unfortunately,
   * onRetrieve is called just before the input is filled with the street address,
   * so we need to set the full address in a state variable and then use it to update
   * the input value after autoComplete has finished.
   */
  const handleRetrieve = useCallback(
    ({features}: AddressAutofillRetrieveResponse) => {
      if (features.length > 0) {
        const {properties} = features[0];
        setFullAddress(properties.full_address);
      }
    },
    []
  );

  useEffect(() => {
    if (fullAddress && fullAddress !== value) {
      onChange({
        target: {
          name,
          value: fullAddress,
        },
      } as ChangeEvent<HTMLInputElement>);
      setFullAddress(undefined);
      const inputElement = inputContainerRef.current?.querySelector('input');
      inputElement?.setAttribute('data-touched', 'false');
      inputElement?.setAttribute('data-dirty', 'false');
      inputElement?.setAttribute('data-pristine', 'true');
    }
  }, [fullAddress, value, name, onChange]);

  const textField = (
    <div ref={inputContainerRef} className={styles.locationAddressContainer}>
      <TextField
        name={name}
        label={label}
        size={size}
        onChange={onChange}
        value={value}
        className={className}
        errorMessage={errorMessage}
        placeholder="Enter a location to see results"
      />
      <FontAwesomeV6Icon iconName="magnifying-glass" />
    </div>
  );

  return accessToken ? (
    <AddressAutofill
      accessToken={accessToken}
      onRetrieve={handleRetrieve}
      options={{streets: false, country: 'US'}}
    >
      {textField}
    </AddressAutofill>
  ) : (
    textField
  );
};
