import * as types from './actionTypes';
import userApi from '../api/userApi';

import { loadImagesSuccess } from './imageActions';
import { updateImagesSuccess } from './imageActions';

export function loadUsersSuccess(users) {
    return {type: types.LOAD_USERS_SUCCESS, users};
}

export function updateUsersSuccess(users) {
    return {type: types.UPDATE_USERS_SUCCESS, users};
}

export function loadUsers() {
    return function(dispatch) {
        const api = new userApi();

        return api.getUsers(0)
            .then(res => {
                dispatch(loadUsersSuccess(res.users));
                dispatch(loadImagesSuccess(res.images));
            })
            .catch(error => {throw(error)})
    };
}

export function updateUsers() {
    return function(dispatch) {
        const api = new userApi();

        return api.getUsers(1)
            .then(res => {
                dispatch(updateUsersSuccess(res.users));
                dispatch(updateImagesSuccess(res.images));
            })
            .catch(error => {throw(error)})
    }
}