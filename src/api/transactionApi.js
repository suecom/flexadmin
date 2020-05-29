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

                const reviews = includes !== undefined ? includes.filter(review => review.type === 'review') : [];

                return { transactions, reviews };
            })
    }
}

export default TransactionApi;