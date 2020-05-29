import * as flexIntegrationSdk from 'sharetribe-flex-integration-sdk';

const integrationSdk = flexIntegrationSdk.createInstance({
    clientId: process.env.REACT_APP_FLEX_INTEGRATION_CLIENT_ID || '58a55f71-7650-423f-bbd3-b4f5e61927b7', 
    clientSecret: process.env.REACT_APP_FLEX_INTEGRATION_CLIENT_SECRET || '14cd97d21409e22c720e58fbf872a2113fb7d1e2',
    baseUrl: process.env.REACT_APP_FLEX_INTEGRATION_BASE_URL || 'http://localhost:8080/'
});

export default integrationSdk;