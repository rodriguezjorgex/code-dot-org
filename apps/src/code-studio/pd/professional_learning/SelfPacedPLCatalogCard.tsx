import React from 'react';

import {CourseOfferingInfo} from './SelfPacedPLCatalog';

import style from './selfPacedPLCatalog.module.scss';

interface CourseOfferingCardProps extends CourseOfferingInfo {
  handleQuickViewClicked: (key: string) => void;
}

const SelfPacedPLCatalogCard: React.FunctionComponent<
  CourseOfferingCardProps
> = ({
  key,
  display_name,
  display_name_with_latest_year,
  marketing_initiative,
  grade_levels,
  duration,
  image,
  cs_topic,
  school_subject,
  device_compatibility,
  course_version_path,
  course_version_id,
  course_id,
  course_offering_id,
  script_id,
  is_standalone_unit,
  description,
  professional_learning_program,
  video,
  published_date,
  available_resources,
  handleQuickViewClicked,
}) => {
  return (
    <div className={style.cardContainer}>
      <p>CARD</p>
    </div>
  );
};

export default SelfPacedPLCatalogCard;
