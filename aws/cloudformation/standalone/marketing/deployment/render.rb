#!/usr/bin/env ruby
require_relative './config'

require 'optparse'

options = {}
OptionParser.new do |opts|
  opts.banner = "Usage: ./deploy.rb <template-name> --region <aws region> --stage <stage>"
  opts.on('--region REGION', 'Specify the AWS region') do |region|
    options[:region] = region
  end
  opts.on('--stage STAGE', 'Specify the stage, e.g. test or production') do |stage|
    options[:stage] = stage
  end
end.parse!

ARGV.shift

unless options.key?(:region)
  print "Missing --region option. Please specify the AWS region."
  exit 1
end

unless options.key?(:stage)
  print "Missing --stage option. Please specify the stage."
  exit 1
end

puts "\nTransforming ERB to YAML for template 'shared_infra'..."
`erb stage=#{options[:stage]} -T - -r ./config.rb  shared-infra.yml.erb > shared-infra.yml `

Config::MARKETING_SITES.each do |short_code, _site|
  puts "\nTransforming ERB to YAML for template 'marketing', SITE=#{short_code}..."
  `erb aws_region=#{options[:region]} stage=#{options[:stage]} site_short_code=#{short_code} -T - -r ./config.rb  marketing.yml.erb > marketing-#{short_code}.yml `
end

if $?&.exitstatus == 0
  puts "Success!"
else
  puts "Error: Failed to transform ERB to YAML."
end
