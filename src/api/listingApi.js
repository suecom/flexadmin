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

    getListings(maxPage = 0) {
        var page = 1;

        return this.getPage(page).then(async (res) => {
            if(res.status === 200 && res !== null && res.data !== undefined) {
                var promises = [], listings  = res.data.data, includes = res.data.included;

                // Start any required requests
                while(page < res.data.meta.totalPages && (maxPage === 0 || page < maxPage)) {
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
            else if(res.status === 401) {
                var l = [], images = [];

                alert('Looks like your REACT_APP_FLEX_INTEGRATION_CLIENT_ID or REACT_APP_FLEX_INTEGRATION_CLIENT_SECRET is invalid');

                return { listings: l, images }
            }
            else {
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

    openListing(id) {
        return integrationSdk.listings.open({id: id})
        .then(response => {
            return response;
        }).catch(error => {
            return error;
        });
    }

    closeListing(id) {
        return integrationSdk.listings.close({id: id})
        .then(response => {
            return response;
        }).catch(error => {
            return error;
        });
    }

    approveListing(id) {
        return integrationSdk.listings.approve({id: id})
        .then(response => {
            return response;
        }).catch(error => {
            return error;
        });
    }
}

export default ListingApi;