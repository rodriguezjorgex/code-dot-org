import Button, {buttonColors} from '@code-dot-org/component-library/button';
import {CheckboxDropdown} from '@code-dot-org/component-library/dropdown';
import {Heading6} from '@code-dot-org/component-library/typography';
import React, {useCallback, ChangeEvent} from 'react';

import {FilterTypeConfig} from '@cdo/apps/templates/courseOfferings/filters/helpers';
import i18n from '@cdo/locale';

import style from './courseOfferingsFilters.module.scss';

interface CourseOfferingsFiltersProps {
  filtersConfigArray: FilterTypeConfig[];
  appliedFilters: Record<string, string[]>;
  updateAppliedFilter: (
    filterKey: string,
    filterValues: string[],
    selectedValue?: string
  ) => void;
  onSelectAllOfOneFilter: (filterKey: string) => void;
  onClearAllOfOneFilter: (filterKey: string) => void;
  onClearAllFilters: () => void;
  children?: React.ReactNode;
}

/** Course offerings filters and their options, for additional filters
 * use children prop for rendering and parent component for logic handling.
 */
const CourseOfferingsFilters: React.FC<CourseOfferingsFiltersProps> = ({
  filtersConfigArray,
  appliedFilters,
  updateAppliedFilter,
  onSelectAllOfOneFilter,
  onClearAllOfOneFilter,
  onClearAllFilters,
  children,
}) => {
  const handleSelect = useCallback(
    (event: ChangeEvent<HTMLInputElement>, filterKey: string) => {
      const value = event.target.value;
      const isChecked = event.target.checked;

      let updatedFilters;
      if (isChecked) {
        // Add checked item into applied filters
        updatedFilters = [...appliedFilters[filterKey], value];
      } else {
        // Remove unchecked item from applied filters
        updatedFilters = appliedFilters[filterKey].filter(
          item => item !== value
        );
      }
      updateAppliedFilter(filterKey, updatedFilters, value);
    },
    [appliedFilters, updateAppliedFilter]
  );

  return (
    <div className={style.catalogFiltersContainer}>
      <div className={style.catalogDropdownFiltersTopRow}>
        <Heading6 className={style.catalogFiltersRowLabel}>
          {i18n.filterBy()}
        </Heading6>
        <Button
          id="clear-filters"
          className={style.catalogClearFiltersButton}
          color={buttonColors.purple}
          type="tertiary"
          text={i18n.clearFilters()}
          onClick={onClearAllFilters}
        />
      </div>
      <div className={style.catalogDropdownFilters}>
        {filtersConfigArray.map(({name, label, options}) => (
          <CheckboxDropdown
            key={name}
            name={name}
            labelText={label}
            allOptions={Object.entries(options).map(([key, value]) => ({
              value: key,
              label: value,
            }))}
            checkedOptions={appliedFilters[name]}
            onChange={e => handleSelect(e, name)}
            onSelectAll={() => onSelectAllOfOneFilter(name)}
            onClearAll={() => onClearAllOfOneFilter(name)}
            selectAllText={i18n.selectAll()}
            clearAllText={i18n.clearAll()}
            size="s"
          />
        ))}
      </div>
      {children && children}
    </div>
  );
};

export default CourseOfferingsFilters;
