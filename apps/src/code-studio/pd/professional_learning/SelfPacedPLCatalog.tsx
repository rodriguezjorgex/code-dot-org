import {
  Heading1,
  Heading5,
  BodyTwoText,
} from '@code-dot-org/component-library/typography';
import React, {useEffect, useState} from 'react';

import SelfPacedPLCatalogCard from './SelfPacedPLCatalogCard';
import SelfPacedPLCatalogFilters from './SelfPacedPLCatalogFilters';

import style from './selfPacedPLCatalog.module.scss';

export interface CourseOfferingInfo {
  key: string;
  display_name: string;
  display_name_with_latest_year: string;
  marketing_initiative: string;
  grade_levels: string;
  duration: string;
  image?: string;
  cs_topic: string;
  school_subject: string;
  device_compatibility: string;
  course_version_path: string;
  course_version_id: number;
  course_id: number;
  course_offering_id: number;
  script_id: number;
  is_standalone_unit: boolean;
  description: string;
  professional_learning_program: string;
  video?: string;
  published_date: Date;
  available_resources?: object;
}

const SelfPacedPLCatalog: React.FunctionComponent<{
  selfPacedPLCourseOfferings: Array<CourseOfferingInfo>;
}> = ({selfPacedPLCourseOfferings}) => {
  const [
    filteredSelfPacedCourseOfferings,
    setFilteredSelfPacedCourseOfferings,
  ] = useState(selfPacedPLCourseOfferings);
  const [expandedCardKey, setExpandedCardKey] = useState('');

  useEffect(() => {
    const expandedCardFound = filteredSelfPacedCourseOfferings.some(
      co => expandedCardKey === co['key']
    );

    if (!expandedCardFound) {
      setExpandedCardKey('');
    }
  }, [expandedCardKey, filteredSelfPacedCourseOfferings]);

  const handleQuickViewClicked = (key: string) => {
    // If Quick View is clicked again to close the card (or the 'X' on the expanded card is clicked), then
    // the expandedCardKey will equal 'key' so we can just set expandedCardKey to ''. Otherwise, expand the
    // card of the given key.
    setExpandedCardKey(expandedCardKey === key ? '' : key);
  };

  // Renders search results based on the applied filters (or shows the No matching course offerings
  // message if no results).
  const renderSearchResults = () => {
    if (filteredSelfPacedCourseOfferings.length > 0) {
      return (
        <div className={style.catalogContentCards}>
          {filteredSelfPacedCourseOfferings.map(courseOffering => (
            <SelfPacedPLCatalogCard
              {...courseOffering}
              handleQuickViewClicked={handleQuickViewClicked}
            />
          ))}
        </div>
      );
    } else {
      return (
        <div className={style.catalogContentNoResults}>
          <Heading5>
            No matching Self-Paced Professional Learning Course Offerings
          </Heading5>
          <BodyTwoText>
            None of our self-paced course offerings match your exact criteria.
            Try broadening your search.
          </BodyTwoText>
        </div>
      );
    }
  };

  return (
    <div className={style.selfPacedPLCatalog}>
      <section className={style.headerContainer}>
        <Heading1>Self-Paced Professional Learning Catalog</Heading1>
      </section>
      <section className={style.bodyContainer}>
        <SelfPacedPLCatalogFilters
          selfPacedPLCourseOfferings={selfPacedPLCourseOfferings}
          filteredSelfPacedCourseOfferings={filteredSelfPacedCourseOfferings}
          setFilteredSelfPacedCourseOfferings={
            setFilteredSelfPacedCourseOfferings
          }
        />
        <div>{renderSearchResults()}</div>
      </section>
    </div>
  );
};

export default SelfPacedPLCatalog;
