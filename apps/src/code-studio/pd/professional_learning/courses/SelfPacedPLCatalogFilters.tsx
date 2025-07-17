import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';

import {queryParams, updateQueryParam} from '@cdo/apps/code-studio/utils';
import CourseOfferingFilters from '@cdo/apps/templates/courseOfferings/filters/CourseOfferingsFilters';
import {
  commonFilterTypes,
  filterByDuration,
  filterByGradeLevel,
  filterByTopic,
  FilterTypeConfig,
} from '@cdo/apps/templates/courseOfferings/filters/helpers';

import {SelfPacedPLCourseInfo} from './SelfPacedPLCatalog';

const FILTERS: FilterTypeConfig[] = [
  commonFilterTypes.grade,
  commonFilterTypes.topic,
  commonFilterTypes.marketingInitiative,
  commonFilterTypes.duration,
];

type SelfPacedFilterKey =
  | 'grade'
  | 'duration'
  | 'topic'
  | 'marketingInitiative';

const getEmptyFilters = () => {
  const emptyFilters: {[key: string]: string[]} = {};
  FILTERS.forEach(filter => {
    emptyFilters[filter.name] = [];
  });
  return emptyFilters;
};

// Filters out invalid values for the given filter key.
const getValidParamValues = (filterKey: string, paramValues: string[]) => {
  const currFilter = FILTERS.find(filter => filter.name === filterKey);

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
  const filterKeys = FILTERS.map(filter => filter.name);

  const initialFilters = getEmptyFilters();
  Object.keys(urlParams).forEach(paramKey => {
    const paramArray: string =
      urlParams[paramKey as keyof typeof urlParams] || '';
    if (paramArray && filterKeys.includes(paramKey as SelfPacedFilterKey)) {
      initialFilters[paramKey] = getValidParamValues(
        paramKey,
        paramArray.split(',')
      );
    }
  });
  return initialFilters;
};

type SelfPacedPLCatalogFiltersProps = {
  allCourses: SelfPacedPLCourseInfo[];
  setFilteredCourses: Dispatch<SetStateAction<SelfPacedPLCourseInfo[]>>;
};

const SelfPacedPLCatalogFilters: React.FunctionComponent<
  SelfPacedPLCatalogFiltersProps
> = ({allCourses, setFilteredCourses}) => {
  const [appliedFilters, setAppliedFilters] = useState(
    getInitialFilterStates()
  );

  // Updates the filtered courses based on the applied filters.
  useEffect(() => {
    const newlyFilteredCourses = allCourses.filter(
      course =>
        filterByGradeLevel(course, appliedFilters.grade) &&
        filterByTopic(course, appliedFilters.topic) &&
        filterByDuration(course, appliedFilters.duration)
    );

    setFilteredCourses(newlyFilteredCourses);
  }, [
    allCourses,
    appliedFilters.duration,
    appliedFilters.grade,
    appliedFilters.topic,
    setFilteredCourses,
  ]);

  // Handles updating the given filter and the URL parameters.
  const handleUpdateFilter = (filterKey: string, values: string[]) => {
    const newFilters = {...appliedFilters};
    newFilters[filterKey] = values;
    setAppliedFilters(newFilters);

    const valuesParamForUrl = values.length > 0 ? values.join(',') : undefined;
    updateQueryParam(filterKey, valuesParamForUrl, true);
  };

  // Clears all filter selections.
  const handleClear = () => {
    setAppliedFilters(getEmptyFilters());
    FILTERS.forEach(filter => updateQueryParam(filter.name, undefined, false));
  };

  return (
    <CourseOfferingFilters
      filtersConfigArray={FILTERS}
      appliedFilters={appliedFilters}
      updateAppliedFilter={handleUpdateFilter}
      onSelectAllOfOneFilter={(filterKey: string) => {
        const allOptions = Object.keys(
          FILTERS.find(filter => filter.name === filterKey)?.options || {}
        );
        handleUpdateFilter(filterKey, allOptions);
      }}
      onClearAllOfOneFilter={(filterKey: string) => {
        handleUpdateFilter(filterKey, []);
      }}
      onClearAllFilters={handleClear}
    />
  );
};

export default SelfPacedPLCatalogFilters;
