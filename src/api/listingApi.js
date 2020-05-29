import * as flexIntegrationSdk from 'sharetribe-flex-integration-sdk';

const integrationSdk = flexIntegrationSdk.createInstance({
    clientId: '58a55f71-7650-423f-bbd3-b4f5e61927b7', //process.env.FLEX_INTEGRATION_CLIENT_ID,
    clientSecret: '14cd97d21409e22c720e58fbf872a2113fb7d1e2', //process.env.FLEX_INTEGRATION_CLIENT_SECRET,
    baseUrl: process.env.FLEX_INTEGRATION_BASE_URL || /*'https://flex-api.sharetribe.com''http://localhost:8080/'*/'https://ffs.oldencars.com',
});

class ListingApi {
    getPage(page) {
        return integrationSdk.listings.query({ 
            'include': 'author,images',
            page: page
        }).then(response => {
            return response;
        }).catch(error => {
            return error;
        });
    }

    getListings() {
        var page = 1;

        return this.getPage(page).then(async (res) => {
                var promises = [], listings  = res.data.data;

                // Start any required requests
                while(page < res.data.meta.totalPages) {
                    promises.push(this.getPage(++page));
                }

                // Wait for them to complete and add the results
                const values = await Promise.all(promises);
                values.map(res => listings = listings.concat(res.data.data))

                return listings;
            })
    }
}

export default ListingApi;