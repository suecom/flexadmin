import integrationSdk from './../flexsdk';

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