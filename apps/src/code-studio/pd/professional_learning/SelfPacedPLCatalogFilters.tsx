import {Button, buttonColors} from '@code-dot-org/component-library/button';
import {Heading6} from '@code-dot-org/component-library/typography';
import React, {Dispatch, SetStateAction, useState} from 'react';

import {queryParams, updateQueryParam} from '@cdo/apps/code-studio/utils';
import CheckboxDropdown from '@cdo/apps/templates/CheckboxDropdown';
import {
  translatedCourseOfferingCsTopics,
  translatedInterdisciplinary,
  translatedCourseOfferingDeviceTypes,
  translatedCourseOfferingDurationsWithTime,
  translatedCourseOfferingMarketingInitiatives,
  translatedGradeLevels,
} from '@cdo/apps/templates/teacherDashboard/CourseOfferingHelpers';
import i18n from '@cdo/locale';

import {SelfPacedPLCourseInfo} from './SelfPacedPLCatalog';

import style from './selfPacedPLCatalog.module.scss';

interface filterType {
  key: string;
  label: string;
  options: {[key: string]: string};
}

const FILTERS: filterType[] = [
  {
    key: 'grade',
    label: i18n.grade(),
    options: translatedGradeLevels,
  },
  {
    key: 'duration',
    label: i18n.duration(),
    options: translatedCourseOfferingDurationsWithTime,
  },
  {
    key: 'topic',
    label: i18n.topic(),
    options: {
      ...translatedInterdisciplinary,
      ...translatedCourseOfferingCsTopics,
    },
  },
  {
    key: 'device',
    label: i18n.device(),
    options: translatedCourseOfferingDeviceTypes,
  },
  {
    key: 'marketingInitiative',
    label: i18n.curriculum(),
    options: translatedCourseOfferingMarketingInitiatives,
  },
];

const getEmptyFilters = () => {
  const emptyFilters: {[key: string]: string[]} = {};
  FILTERS.forEach(filter => {
    emptyFilters[filter.key] = [];
  });
  return emptyFilters;
};

// Filters out invalid values for the given filter key.
const getValidParamValues = (filterKey: string, paramValues: string[]) => {
  const currFilter = FILTERS.find(filter => filter.key === filterKey);

  if (!Array.isArray(paramValues)) {
    paramValues = [paramValues];
  }
  return currFilter
    ? paramValues.filter(paramValue =>
        Object.keys(currFilter.options).includes(paramValue)
      )
    : [];
};

// Returns initial filter states based on URL parameters (returns empty filters if
// no relevant parameters in the URL).
const getInitialFilterStates = () => {
  const urlParams = queryParams();
  const filterKeys = FILTERS.map(filter => filter.key);

  const initialFilters = getEmptyFilters();
  Object.keys(urlParams).forEach(paramKey => {
    const paramArray: string = urlParams[paramKey as keyof object] || '';
    if (paramArray && filterKeys.includes(paramKey)) {
      initialFilters[paramKey] = getValidParamValues(
        paramKey,
        paramArray.split(',')
      );
    }
  });
  return initialFilters;
};

const SelfPacedPLCatalogFilters: React.FunctionComponent<{
  selfPacedPLCourseOfferings: Array<SelfPacedPLCourseInfo>;
  filteredSelfPacedCourseOfferings: Array<SelfPacedPLCourseInfo>;
  setFilteredSelfPacedCourseOfferings: Dispatch<
    SetStateAction<SelfPacedPLCourseInfo[]>
  >;
}> = ({
  selfPacedPLCourseOfferings,
  filteredSelfPacedCourseOfferings,
  setFilteredSelfPacedCourseOfferings,
}) => {
  const [appliedFilters, setAppliedFilters] = useState(
    getInitialFilterStates()
  );

  // Handles updating the given filter and the URL parameters.
  const handleUpdateFilter = (filterKey: string, values: string[]) => {
    const newFilters = {...appliedFilters};
    newFilters[filterKey] = values;
    setAppliedFilters(newFilters);

    const valuesParamForUrl = values.length > 0 ? values.join(',') : undefined;
    updateQueryParam(filterKey, valuesParamForUrl, true);
  };

  // Selects the given value in the given filter.
  const handleSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    filterKey: string
  ) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    let updatedFilters;
    if (isChecked) {
      // Add checked item into applied filters
      updatedFilters = [...appliedFilters[filterKey], value];
    } else {
      // Remove unchecked item from applied filters
      updatedFilters = appliedFilters[filterKey].filter(item => item !== value);
    }
    handleUpdateFilter(filterKey, updatedFilters);
  };

  // Selects all options within the given filter.
  const handleSelectAllOfFilter = (filterKey: string) => {
    const currFilter = FILTERS.find(filter => filter.key === filterKey);
    if (currFilter) {
      handleUpdateFilter(filterKey, Object.keys(currFilter.options));
    }
  };

  // Clears all filter selections.
  const handleClear = () => {
    setAppliedFilters(getEmptyFilters());
    FILTERS.forEach(filter => updateQueryParam(filter.key, undefined, false));
  };

  // Clears selections within the given filter.
  const handleClearAllOfFilter = (filterKey: string) => {
    handleUpdateFilter(filterKey, []);
  };

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
          text={i18n.clearFilters()}
          onClick={handleClear}
        />
      </div>
      <div className={style.catalogDropdownFilters}>
        {FILTERS.map(filter => (
          <CheckboxDropdown
            key={filter.key}
            name={filter.key}
            label={filter.label}
            allOptions={filter.options}
            checkedOptions={appliedFilters[filter.key] || []}
            onChange={e => handleSelect(e, filter.key)}
            handleSelectAll={() => handleSelectAllOfFilter(filter.key)}
            handleClearAll={() => handleClearAllOfFilter(filter.key)}
          />
        ))}
      </div>
    </div>
  );
};

export default SelfPacedPLCatalogFilters;
