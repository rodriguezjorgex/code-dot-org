import {Button, LinkButton} from '@code-dot-org/component-library/button';
import TextField from '@code-dot-org/component-library/textField';
import {
  Heading1,
  Heading2,
  BodyTwoText,
  OverlineTwoText,
} from '@code-dot-org/component-library/typography';
import React, {useState} from 'react';

import {getAuthenticityToken} from '@cdo/apps/util/AuthenticityTokenStore';

import style from './regionalWorkshopCatalog.module.scss';

export default function RegionalWorkshopCatalog() {
  const [zipCode, setZipCode] = useState('');
  const [regionalPartner, setRegionalPartner] = useState('');
  const [availableWorkshops, setAvailableWorkshops] = useState([]);

  const handleZipChage = async zip => {
    setZipCode(zip);

    if (zip.length === 5) {
      try {
        const response = await fetch(
          '/dashboardapi/v1/pd/regional_workshop_data',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-Token': await getAuthenticityToken(),
            },
            body: JSON.stringify({zip_code: zip}),
          }
        );

        if (response.ok) {
          const jsonData = await response.json();
          setRegionalPartner(jsonData.regional_partner);
          setAvailableWorkshops(jsonData.available_workshops);
        }
      } catch (error) {
        console.error(
          'Error fetching regional partner and available workshops:',
          error
        );
      }
    }
  };

  return (
    <div className={style.workshopCatalog}>
      <section className={style.headerContainer}>
        <div className={style.headerText}>
          <Heading1>Find your local workshop and apply</Heading1>
          <BodyTwoText>
            Look up details of the Professional Learning Program in your region
            by submitting your zip code.
          </BodyTwoText>
        </div>
        <div className={style.zipSearchContainer}>
          <div className={style.zipSearchInput}>
            <TextField
              id="zipCode"
              name="zipCode"
              label="School ZIP Code:"
              onChange={e => handleZipChage(e.target.value)}
              value={zipCode}
              maxLength={255}
              placeholder="12345"
            />
            <Button text="Submit" color="purple" onClick={() => {}} />
          </div>
          <div className={style.rpInfoContainer}>
            <OverlineTwoText className={style.rpInfoHeader}>
              Your Regional Partner
            </OverlineTwoText>
            <div className={style.rpInfo}>
              {regionalPartner ? (
                <BodyTwoText className={style.rpName}>
                  {regionalPartner}
                </BodyTwoText>
              ) : (
                <BodyTwoText className={style.rpNameMissing}>
                  Zip code required
                </BodyTwoText>
              )}
              <div className={style.rpInfoButtons}>
                <LinkButton
                  color="black"
                  type="secondary"
                  href={'/'}
                  size="xs"
                  text="Partner info"
                />
                <LinkButton
                  color="black"
                  type="secondary"
                  href={'/'}
                  size="xs"
                  text="Contact"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className={style.workshopContainer}>
        <div className={style.workshopContentContainer}>
          <Heading2>Upcoming workshops</Heading2>
          <BodyTwoText>
            Workshops are always being added. If you do not see the workshop you
            are looking for check back again soon or{' '}
            <a href="/">contact your regional partner</a>.
          </BodyTwoText>
        </div>
        <div>
          <ul>
            {availableWorkshops.map(workshop => (
              <li>{workshop.id}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
