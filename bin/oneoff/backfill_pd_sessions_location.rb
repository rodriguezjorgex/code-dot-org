#!/usr/bin/env ruby

# As of April 10, 2025:
# The total number of sessions with available workshop location data is ~ 20k.
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
      begin
        session.save!
        count += 1
        puts "Updated #{count} sessions" if count % 100 == 0
      rescue => exception
        puts "Failed to update session #{session.id}: #{exception.message}"
      end
    end
  end

puts "#{count} sessions updated with workshop location"
