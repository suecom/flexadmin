import * as flexIntegrationSdk from 'sharetribe-flex-integration-sdk';
import * as sharetribeSdk from 'sharetribe-flex-sdk';

console.log('Using: ', process.env.REACT_APP_FLEX_INTEGRATION_BASE_URL || 'https://flex-api.sharetribe.com')

export const integrationSdk = flexIntegrationSdk.createInstance({
    clientId: process.env.REACT_APP_FLEX_INTEGRATION_CLIENT_ID || '58a55f71-7650-423f-bbd3-b4f5e6000000', 
    clientSecret: process.env.REACT_APP_FLEX_INTEGRATION_CLIENT_SECRET || '14cd97d21409e22c720e58fbf872a2113f000000',
    baseUrl: process.env.REACT_APP_FLEX_INTEGRATION_BASE_URL || 'https://flex-api.sharetribe.com'
});

export const marketplaceSdk = sharetribeSdk.createInstance({
    clientId: process.env.REACT_APP_SHARETRIBE_SDK_CLIENT_ID || 'f52eecbc-0aee-406e-bcdd-866854dd5079', 
    baseUrl: process.env.REACT_APP_FLEX_INTEGRATION_BASE_URL || 'https://flex-api.sharetribe.com'
});