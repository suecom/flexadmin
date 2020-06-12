import { integrationSdk } from './../flexsdk';

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
            if(res !== null && res.data !== undefined) {
                var promises = [], users  = res.data.data, includes = res.data.included;;

                // Start any required requests
                while(page < res.data.meta.totalPages) {
                    promises.push(this.getPage(++page));
                }

                // Wait for them to complete and add the results
                const values = await Promise.all(promises);
                values.forEach(res => {
                    users = users.concat(res.data.data);
                    includes = includes.concat(res.data.included);
                })

                const images = includes !== undefined ? includes.filter(item => item.type === 'image') : [];

                return { users, images };
            }
            else {
                var u = [], images = [];

                return { users: u, images }
            }
        })
    }

    updateUser(updates) {
        return integrationSdk.users.updateProfile(updates)
        .then(response => {
            return response;
        }).catch(error => {
            return error;
        });
    }
}

export default UserApi;