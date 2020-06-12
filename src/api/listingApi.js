import { integrationSdk } from './../flexsdk';

class ListingApi {
    getPage(page) {
        return integrationSdk.listings.query({ 
            'state': 'published,draft,pendingApproval,closed',
            'deleted': 'true,false',
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
            if(res !== null && res.data !== undefined) {
                var promises = [], listings  = res.data.data, includes = res.data.included;

                // Start any required requests
                while(page < res.data.meta.totalPages) {
                    promises.push(this.getPage(++page));
                }

                // Wait for them to complete and add the results
                const values = await Promise.all(promises);
                values.forEach(res => {
                    listings = listings.concat(res.data.data);
                    includes = includes.concat(res.data.included);
                })

                const images = includes !== undefined ? includes.filter(item => item.type === 'image') : [];

                return { listings, images };
            }
            else {
                var l = [], images = [];

                return { listings: l, images }
            }
        })
    }

    updateListing(updates) {
        return integrationSdk.listings.update(updates)
        .then(response => {
            return response;
        }).catch(error => {
            return error;
        });
    }
}

export default ListingApi;