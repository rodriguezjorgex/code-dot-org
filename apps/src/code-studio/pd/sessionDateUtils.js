import moment from 'moment-timezone';
import PropTypes from 'prop-types';

export const sessionCalendarShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  start: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
  is_local: PropTypes.bool.isRequired,
  session_format: PropTypes.string.isRequired,
  location_address: PropTypes.string,
  meeting_link: PropTypes.string,
  description: PropTypes.string,
  notes: PropTypes.string,
});

export const getSessionDate = ({session, format, isLocal = false}) =>
  isLocal
    ? moment.utc(session.start).format(format)
    : moment
        .utc(session.start)
        .tz(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC')
        .format(format);

export const getSessionTimes = ({session, format, isLocal = false}) => {
  const userTimeZone =
    Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const tzAbbreviation = isLocal
    ? 'local'
    : moment.utc(session.start).tz(userTimeZone).format('z');
  const startTime = isLocal
    ? moment.utc(session.start).format(format)
    : moment.utc(session.start).tz(userTimeZone).format(format);
  const endTime = isLocal
    ? moment.utc(session.end).format(format)
    : moment.utc(session.end).tz(userTimeZone).format(format);

  return {startTime, endTime, tzAbbreviation};
};
