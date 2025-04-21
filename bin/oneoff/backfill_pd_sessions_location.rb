#!/usr/bin/env ruby

require_relative '../../dashboard/config/environment'

Pd::Session.
  includes(:workshop).
  where(
    'pd_workshops.location_name IS NOT NULL OR pd_workshops.location_address IS NOT NULL'
  ).
  find_each(batch_size: 500) do |session|
    workshop = session.workshop
    next unless workshop

    # Backfill location_name and location_address
    session.location_name = workshop.location_name
    session.location_address = workshop.location_address

    # Save only if changes were made
    # session.save! if session.changed?
    puts "update session #{session.id} with location_name: #{workshop.location_name}, location_address: #{workshop.location_address}" if session.changed?
  end
