import * as flexIntegrationSdk from 'sharetribe-flex-integration-sdk';

const integrationSdk = flexIntegrationSdk.createInstance({
    clientId: '58a55f71-7650-423f-bbd3-b4f5e61927b7', //process.env.FLEX_INTEGRATION_CLIENT_ID,
    clientSecret: '14cd97d21409e22c720e58fbf872a2113fb7d1e2', //process.env.FLEX_INTEGRATION_CLIENT_SECRET,
    baseUrl: process.env.FLEX_INTEGRATION_BASE_URL || /*'https://flex-api.sharetribe.com''http://localhost:8080/'*/'https://ffs.oldencars.com',
});

class UserApi {
    getPage(page) {
        return integrationSdk.users.query({ 
            'include': 'profileImage,stripeAccount',
            page: page
        }).then(response => {
            return response;
        }).catch(error => {
            return error;
        });
    }

    getUsers() {
        var page = 1;

        return this.getPage(page).then(async (res) => {
                var promises = [], users  = res.data.data;

                // Start any required requests
                while(page < res.data.meta.totalPages) {
                    promises.push(this.getPage(++page));
                }

                // Wait for them to complete and add the results
                const values = await Promise.all(promises);
                values.map(res => users = users.concat(res.data.data))

                return users;
            })
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