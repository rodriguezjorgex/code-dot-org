#!/usr/bin/env ruby

# As of April 10, 2025:
# The total number of sessions with available workshop location data is 19_686
# The sessions table itself only has ~ 150 more sessions, so I decided not to join
# with the workshops table to filter to just workshops with location data.

require_relative '../../dashboard/config/environment'

count = 0

Pd::Session.
  includes(:workshop).
  find_each(batch_size: 500) do |session|
    workshop = session.workshop
    next unless workshop

    session.location_name = workshop.location_name
    session.location_address = workshop.location_address

    if session.changed?
      puts "Updating session #{session.id} with new location data"
      session.save!
      count += 1
    end
  end

puts "#{count} sessions updated with workshop location"
