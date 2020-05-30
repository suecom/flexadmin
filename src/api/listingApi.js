import integrationSdk from './../flexsdk';

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