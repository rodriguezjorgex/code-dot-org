'use strict';

// This variable is injected via CloudFormation string substitution. This file must be used
// in conjunction with the CloudFormation Sub function to set the value of MarketingDomainName.
const marketingDomain = '${InternalMarketingDomainName}'

const marketingPaths = {
  // Add key-value pairs for each path that should be served by the CMS
  // e.g. '/videos': true,
}

const nextJsAssetsPath = '/_next/static/';

// Remove the localized portion of paths, if there is a localized portion.
// For example:
// 1. /en-US/engineering/all-the-things becomes /engineering/all-the-things
// 2. /engineering/all-the-things remains unchanged
function extractPaths(uri) {
  const parts = uri.split('/').filter(Boolean); // Remove empty segments
  const localeRegex = /^[a-z]{2}(-[A-Z]{2})?$/;

  if (parts.length && localeRegex.test(parts[0])) {
    // Has locale, return everything after locale
    return '/' + parts.slice(1).join('/');
  }

  // No locale, return as-is
  return uri;
}

module.exports.handler = (event, context, callback) => {
  try {
    const request = event?.Records?.[0]?.cf?.request;
    const uri = request?.uri;
    const normalizedURI = extractPaths(uri);

    // Set CMS origin if the requested path matches
    if (marketingPaths[normalizedURI] || (uri && uri.startsWith(nextJsAssetsPath))) {
      request.origin = {
        custom: {
          domainName: marketingDomain,
          port: 443,
          protocol: 'https',
          path: '',
          sslProtocols: ['TLSv1.2'],
          readTimeout: 30,
          keepaliveTimeout: 5,
          customHeaders: {},
        },
      };
  
      // Update the Host header to match the new origin
      request.headers['host'] = [{ key: 'Host', value: marketingDomain }];
    }
  
    callback(null, request);
  } catch (error) {
    console.error('Marketing router lambda error:', error);

    // If an error occurs, don't block. Pass through the request.
    callback(null, request);
  }
};