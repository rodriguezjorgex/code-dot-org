import {Button, buttonColors} from '@code-dot-org/component-library/button';
import {Heading6} from '@code-dot-org/component-library/typography';
import React, {Dispatch, SetStateAction} from 'react';

import i18n from '@cdo/locale';

import {CourseOfferingInfo} from './SelfPacedPLCatalog';

import style from './selfPacedPLCatalog.module.scss';

const SelfPacedPLCatalogFilters: React.FunctionComponent<{
  selfPacedPLCourseOfferings: Array<CourseOfferingInfo>;
  filteredSelfPacedCourseOfferings: Array<CourseOfferingInfo>;
  setFilteredSelfPacedCourseOfferings: Dispatch<
    SetStateAction<CourseOfferingInfo[]>
  >;
}> = ({
  selfPacedPLCourseOfferings,
  filteredSelfPacedCourseOfferings,
  setFilteredSelfPacedCourseOfferings,
}) => {
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
          onClick={() => {}}
        />
      </div>
      <div className={style.catalogDropdownFilters} />
    </div>
  );
};

export default SelfPacedPLCatalogFilters;
