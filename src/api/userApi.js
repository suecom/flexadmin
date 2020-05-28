import * as flexIntegrationSdk from 'sharetribe-flex-integration-sdk';

const integrationSdk = flexIntegrationSdk.createInstance({
    clientId: '58a55f71-7650-423f-bbd3-b4f5e61927b7', //process.env.FLEX_INTEGRATION_CLIENT_ID,
    clientSecret: '14cd97d21409e22c720e58fbf872a2113fb7d1e2', //process.env.FLEX_INTEGRATION_CLIENT_SECRET,
    baseUrl: process.env.FLEX_INTEGRATION_BASE_URL || 'https://flex-api.sharetribe.com',
});

class UserApi {
    static getUsers() {
        return integrationSdk.users.query({ 
                'include': 'profileImage,stripeAccount',
                expand: true
            }).then(response => {
                return response.data.data;
            }).catch(error => {
                return error;
            });


        /*
        return fetch('http://localhost:8081/api/users').then(response => {
            return response.json();
        }).catch(error => {
            return error;
        });
        */
    }
}

export default UserApi;