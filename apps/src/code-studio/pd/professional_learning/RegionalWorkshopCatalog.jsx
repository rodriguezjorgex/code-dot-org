import {Button, LinkButton} from '@code-dot-org/component-library/button';
import TextField from '@code-dot-org/component-library/textField';
import {
  Heading1,
  Heading2,
  BodyTwoText,
  Overline2,
} from '@code-dot-org/component-library/typography';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {connect} from 'react-redux';

import style from './regionalWorkshopCatalog.module.scss';

export const RegionalWorkshopCatalog = ({responsiveSize, sourcePageId}) => {
  const [zipCode, setZipCode] = useState('');
  return (
    <div>
      <div className={style.headerContainer}>
        <div className={style.headerText}>
          <Heading1>Find your local workshop and apply</Heading1>
          <BodyTwoText>
            Look up details of the Professional Learning Program in your region
            by submitting your zip code.
          </BodyTwoText>
        </div>
        <div className={style.zipSearchContainer}>
          <div className={style.zipSearchBox}>
            <div className={style.zipSearchBoxHeader}>
              <BodyTwoText>School ZIP Code:</BodyTwoText>
            </div>
            <div className={style.zipSearchBar}>
              <TextField
                id="zipCode"
                name="zipCode"
                label={'School ZIP Code:'}
                onChange={e => setZipCode(e.target.value)}
                value={zipCode}
                maxLength={255}
                placeHolder={'12345'}
              />
              <Button text={'Submit'} color={'purple'} onClick={() => {}} />
            </div>
          </div>
          <div className={style.rpInfoContainer}>
            <div className={style.rpInfoHeader}>
              <Overline2>Your Regional Partner</Overline2>
            </div>
            <div className={style.rpInfo}>
              <BodyTwoText>Sample Regional Partner Name</BodyTwoText>
              <LinkButton
                color={'white'}
                href={'/'}
                size="s"
                text={'Partner info'}
              />
              <LinkButton
                color={'white'}
                href={'/'}
                size="s"
                text={'Contact'}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={style.workshopContainer}>
        <Heading2>Upcoming workshops</Heading2>
      </div>
    </div>
  );
};

RegionalWorkshopCatalog.propTypes = {
  responsiveSize: PropTypes.oneOf(['lg', 'md', 'sm', 'xs']).isRequired,
  sourcePageId: PropTypes.string,
};

export const UnconnectedRegionalWorkshopCatalog = RegionalWorkshopCatalog;

export default connect(state => ({
  responsiveSize: state.responsive.responsiveSize,
}))(RegionalWorkshopCatalog);
