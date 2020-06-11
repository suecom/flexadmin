import integrationSdk from './../flexsdk';

class TransactionApi {
    getPage(page) {
        return integrationSdk.transactions.query({ 
            'include': 'listing,provider,customer,reviews,messages,reviews.author,reviews.subject,messages.sender',
            page: page
        }).then(response => {
            return response;
        }).catch(error => {
            return error;
        });
    }

    getTransactions() {
        var page = 1;

        return this.getPage(page).then(async (res) => {
            if(res !== null && res.data !== undefined) {
                var promises = [], transactions  = res.data.data, includes = res.data.included;

                // Start any required requests
                while(page < res.data.meta.totalPages) {
                    promises.push(this.getPage(++page));
                }

                // Wait for them to complete and add the results
                const values = await Promise.all(promises);
                values.forEach(res => {
                    transactions = transactions.concat(res.data.data);
                    includes = includes.concat(res.data.included);
                })

                const reviews = includes !== undefined ? includes.filter(item => item.type === 'review') : [];
                if(reviews.length > 0 && reviews[0].relationships.listing === undefined) {
                    // This is the case using the Sharetribe Integration API (no nesting listing relationships). Build...
                    reviews.forEach(rev => {
                        for(var i = 0; i < transactions.length && rev.relationships.listing === undefined; i++) {
                            for(var j = 0; transactions[i].relationships.reviews.data !== null && j < transactions[i].relationships.reviews.data.length; j++) {
                                if(transactions[i].relationships.reviews.data[j].id.uuid === rev.id.uuid) {
                                    rev.relationships.listing = transactions[i].relationships.listing;
                                    break;
                                }
                            } 
                        }
                    })
                }
                const messages = includes !== undefined ? includes.filter(item => item.type === 'message') : [];

                return { transactions, reviews, messages };
            }
            else {
                var t = [], reviews = [], messages = [];

                return { transactions: t, reviews, messages }
            }
        })
    }
}

export default TransactionApi;