import React from 'react';
import {JsonLd} from 'react-schemaorg';
import type {
  EducationEvent,
  EventStatusType,
  Offer,
  Place,
  VirtualLocation,
  Organization,
  ItemAvailability,
} from 'schema-dts';

import {WorkshopFormats} from '@cdo/apps/generated/pd/sharedWorkshopConstants';

import type {
  GetWorkshopInfoScriptDataResponse,
  OrganizerInfo,
  SessionInfo,
} from './../types';

const EVENT_ATTENDANCE_MODES = {
  in_person: 'https://schema.org/OfflineEventAttendanceMode',
  hybrid: 'https://schema.org/MixedEventAttendanceMode',
  virtual: 'https://schema.org/OnlineEventAttendanceMode',
} as const;

const EVENT_STATUSES = {
  Scheduled: 'https://schema.org/EventScheduled',
  Cancelled: 'https://schema.org/EventCancelled',
  Postponed: 'https://schema.org/EventPostponed',
  Rescheduled: 'https://schema.org/EventRescheduled',
  MovedOnline: 'https://schema.org/EventMovedOnline',
} as const;

const getWorkshopDates = (sessions: SessionInfo[]) => {
  if (!sessions?.length) return {startDate: undefined, endDate: undefined};

  const sortedSessions = sessions
    .slice()
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  return {
    startDate: sortedSessions[0]?.start,
    endDate: sortedSessions[sortedSessions.length - 1]?.end,
  };
};

const getAvailability = (
  capacity: number,
  num_enrollments: number
): ItemAvailability => {
  if (capacity > 0 && num_enrollments >= capacity) {
    return 'https://schema.org/SoldOut';
  }
  return 'https://schema.org/InStock';
};

const determineWorkshopLocationName = (
  format: keyof typeof WorkshopFormats,
  location_name?: string,
  sessions?: SessionInfo[]
): string => {
  if (format === 'virtual') {
    return '';
  }

  // priority 1: main location_name from workshop itself
  if (location_name?.trim()) {
    return location_name.trim();
  }

  // priority 2: attempt extracting from sessions
  if (sessions && sessions.length > 0) {
    const locationNames = sessions
      .map(session => session.location_name?.trim())
      .filter((name): name is string => Boolean(name));

    const uniqueLocations = Array.from(new Set(locationNames));

    if (uniqueLocations.length === 1) {
      return uniqueLocations[0];
    }
    if (uniqueLocations.length > 1) {
      return 'Location varies by session';
    }
  }

  // priority 3: final fallback
  return 'Location To Be Determined';
};

const getLocation = (
  format: keyof typeof WorkshopFormats,
  location_name?: string,
  sessions?: SessionInfo[]
): Place | VirtualLocation => {
  if (format === 'virtual') {
    return {
      '@type': 'VirtualLocation',
      url: window.location.href,
    };
  }

  return {
    '@type': 'Place',
    name: determineWorkshopLocationName(format, location_name, sessions),
  };
};

const getOffer = (
  fee?: string,
  capacity?: number,
  num_enrollments?: number
): {offer: Offer; priceNumber: number} => {
  const priceNumber = fee && !isNaN(Number(fee)) ? Number(fee) : 0;

  const offer: Offer = {
    '@type': 'Offer',
    price: priceNumber,
    priceCurrency: 'USD',
    availability: getAvailability(capacity ?? 0, num_enrollments ?? 0),
    url: window.location.href,
  };

  return {offer, priceNumber};
};
const getOrganizer = (
  organizer?: OrganizerInfo,
  regional_partner_name?: string
): Organization => {
  return {
    '@type': 'Organization',
    name: organizer?.name || regional_partner_name || 'Code.org',
    email: organizer?.email,
  };
};

/** JSON-LD for structured data. Needed for Google SEO.
 *  (see https://developers.google.com/search/docs/appearance/structured-data/event)
 */
const WorkshopEventJsonLdData: React.FC<
  GetWorkshopInfoScriptDataResponse
> = props => {
  const {
    name,
    description,
    sessions,
    format,
    location_name,
    fee,
    capacity,
    num_enrollments,
    organizer,
    regional_partner_name,
  } = props;

  const {startDate, endDate} = getWorkshopDates(sessions);
  const {offer, priceNumber} = getOffer(fee, capacity, num_enrollments);

  return (
    <JsonLd<EducationEvent>
      item={{
        '@context': 'https://schema.org',
        '@type': 'EducationEvent',
        name,
        startDate,
        endDate,
        description,
        eventAttendanceMode: EVENT_ATTENDANCE_MODES[format],
        eventStatus: EVENT_STATUSES.Scheduled as EventStatusType,
        location: getLocation(format, location_name),
        organizer: getOrganizer(organizer, regional_partner_name),
        offers: offer,
        isAccessibleForFree: priceNumber === 0 ? true : undefined,
      }}
    />
  );
};

export default WorkshopEventJsonLdData;
