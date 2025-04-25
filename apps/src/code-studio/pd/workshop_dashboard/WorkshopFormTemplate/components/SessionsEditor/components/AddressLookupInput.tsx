import TextField, {
  TextFieldProps,
} from '@code-dot-org/component-library/textField';
import type {AddressAutofillRetrieveResponse} from '@mapbox/search-js-core';
import {AddressAutofill} from '@mapbox/search-js-react';
import React, {ChangeEvent, useCallback, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

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
    }
  }, [fullAddress, value, name, onChange]);

  const textField = (
    <TextField
      name={name}
      label={label}
      size={size}
      onChange={onChange}
      value={value}
      className={className}
      errorMessage={errorMessage}
    />
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
