import HeroBanner from '@code-dot-org/component-library/heroBanner';
import {
  Heading5,
  BodyTwoText,
} from '@code-dot-org/component-library/typography';
import {configureStore} from '@reduxjs/toolkit';
import React, {useEffect, useState} from 'react';
import {Provider} from 'react-redux';

// import CurriculumCatalog from '@cdo/apps/templates/curriculumCatalog/CurriculumCatalog';
import {defaultImageSrc} from '@cdo/apps/templates/curriculumCatalog/curriculumCatalogConstants';
import teacherSections from '@cdo/apps/templates/teacherDashboard/teacherSectionsRedux';
import PLCatalogHeroBannerImage from '@cdo/static/professional-learning/courses/selfPacedPLCatalog-HeroBanner-illustration.png';

import SelfPacedPLCatalogCard from './../SelfPacedPLCatalogCard';
import SelfPacedPLCatalogFilters from './SelfPacedPLCatalogFilters';

// eslint-disable-next-line import/no-duplicates
import style from './selfPacedPLCatalog.module.scss';
// eslint-disable-next-line no-duplicate-imports,import/no-duplicates
import moduleStyles from './selfPacedPLCatalog.module.scss';

export interface SelfPacedPLCourseInfo {
  key: string;
  display_name: string;
  grade_levels: string;
  duration_in_hours: number;
  cs_topic: string;
  description: string;
  image?: string;
  video?: string;
  course_version_path: string;
  self_paced_pl_course_offering_path?: string;
}

const SelfPacedPLCatalog: React.FunctionComponent<{
  selfPacedPLCourseOfferings: SelfPacedPLCourseInfo[];
}> = ({selfPacedPLCourseOfferings, ...rest}) => {
  // console.log('SelfPacedPLCatalog props:', selfPacedPLCourseOfferings, rest);
  // const availableCourses = selfPacedPLCourseOfferings.filter(
  //   course => course.self_paced_pl_course_offering_path
  // );
  // console.log(
  //   'Courses without image',
  //   availableCourses.filter(course => !course.image)
  // );
  // console.log(
  //   'Courses without cs_topic',
  //   availableCourses.filter(course => course.cs_topic)
  // );
  // console.log(
  //   'Courses without grade_levels',
  //   availableCourses.filter(course => !course.grade_levels)
  // );

  console.log(selfPacedPLCourseOfferings);
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

  const updateExpandedCardKey = (key: string) => {
    // If updateExpandedCardKey receives the same key as it currently is, then that indicates it's open and
    // we want to close it so we set it to ''. Otherwise, we expand the card of the provided key.
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
              key={courseOffering.key}
              courseKey={courseOffering.key}
              displayName={courseOffering.display_name}
              gradeLevels={courseOffering.grade_levels}
              duration={courseOffering.duration_in_hours}
              csTopics={courseOffering.cs_topic}
              description={courseOffering.description}
              image={courseOffering.image || defaultImageSrc}
              video={courseOffering.video}
              pathToCourse={courseOffering.course_version_path}
              isExpanded={expandedCardKey === courseOffering.key}
              updateExpandedCardKey={() =>
                updateExpandedCardKey(courseOffering.key)
              }
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
      <Provider store={configureStore({reducer: {teacherSections}})}>
        <HeroBanner
          className={moduleStyles.plCatalogHeroBanner}
          data-theme="Dark"
          heading="Explore self-paced professional learning"
          subHeading="Professional learning offerings to support teachers in every stage of their computer science teaching journey."
          imageProps={{src: PLCatalogHeroBannerImage}}
          withWideText
          hideImageOnSmallScreen
        />
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

        {/*<CurriculumCatalog*/}
        {/*  curriculaData={selfPacedPLCourseOfferings}*/}
        {/*  isInUS*/}
        {/*  languageNativeName={'adsa'}*/}
        {/*/>*/}
      </Provider>
    </div>
  );
};

export default SelfPacedPLCatalog;
