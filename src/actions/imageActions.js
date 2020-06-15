import * as types from './actionTypes';
import userApi from '../api/userApi';

import { loadUsersSuccess } from './userActions';
import { updateUsersSuccess } from './userActions';

export function loadImagesSuccess(images) {
    return {type: types.LOAD_IMAGES_SUCCESS, images};
}

export function updateImagesSuccess(images) {
    return {type: types.UPDATE_IMAGES_SUCCESS, images};
}

export function loadImages() {
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

export function updateImages() {
    return function(dispatch) {
        const api = new userApi();

        return api.getUsers(1)
            .then(res => {
                dispatch(updateUsersSuccess(res.users));
                dispatch(updateImagesSuccess(res.images));
            })
            .catch(error => {throw(error)})
    };
}