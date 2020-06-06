import * as flexIntegrationSdk from 'sharetribe-flex-integration-sdk';

const integrationSdk = flexIntegrationSdk.createInstance({
    clientId: process.env.REACT_APP_FLEX_INTEGRATION_CLIENT_ID || '58a55f71-7650-423f-bbd3-b4f5e6000000', 
    clientSecret: process.env.REACT_APP_FLEX_INTEGRATION_CLIENT_SECRET || '14cd97d21409e22c720e58fbf872a2113f000000',
    baseUrl: process.env.REACT_APP_FLEX_INTEGRATION_BASE_URL || 'https://flex-api.sharetribe.com'
});

export default integrationSdk;