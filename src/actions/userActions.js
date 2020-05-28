import * as types from './actionTypes';
import userApi from '../api/userApi';


export function loadUsersSuccess(users) {
    return {type: types.LOAD_USERS_SUCCESS, users};
}

export function loadUsers() {
    return function(dispatch) {
        return userApi.getUsers().then(users => {
            dispatch(loadUsersSuccess(users));
        }).catch(error => {
            throw(error);
        });
    };
}