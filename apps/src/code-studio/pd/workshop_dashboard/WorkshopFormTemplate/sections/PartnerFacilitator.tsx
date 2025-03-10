import {SimpleDropdown} from '@code-dot-org/component-library/dropdown';
import {Heading2} from '@code-dot-org/component-library/typography';
import classNames from 'classnames';
import React, {FC, useMemo} from 'react';

import {SectionProps} from '../types';

import commonStyles from '../styles.module.scss';

export const PartnerFacilitator: FC<SectionProps> = ({
  config: {
    fields: {regional_partner_id},
  },
  state,
  handleChange,
  regionalPartners,
}) => {
  const regionalPartnerOptions = useMemo(() => {
    const options = [{value: '', text: 'None'}];

    regionalPartners?.forEach(({id, name}) => {
      options.push({
        value: id.toString(),
        text: name,
      });
    });

    return options;
  }, [regionalPartners]);
  return (
    <>
      <Heading2 visualAppearance="heading-sm">
        Partner and Facilitator Information
      </Heading2>
      <div className={commonStyles.row}>
        {regional_partner_id && (
          <SimpleDropdown
            name="regional_partner_id"
            onChange={e =>
              handleChange({
                regionalPartnerId: e.target.value
                  ? Number(e.target.value)
                  : null,
              })
            }
            styleAsFormField={true}
            items={regionalPartnerOptions}
            selectedValue={state.regionalPartnerId?.toString() ?? ''}
            labelText="Regional partner"
            size="s"
            dropdownTextThickness="thin"
            className={classNames(commonStyles.item, {
              [commonStyles.required]: regional_partner_id.required,
            })}
          />
        )}
      </div>
    </>
  );
};
