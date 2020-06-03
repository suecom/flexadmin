import * as types from './actionTypes';
import userApi from '../api/userApi';

import { loadUsersSuccess } from './userActions'

export function loadImagesSuccess(images) {
    return {type: types.LOAD_IMAGES_SUCCESS, images};
}

export function loadImages() {
    return function(dispatch) {
        const api = new userApi();

        return api.getUsers()
            .then(res => {
                dispatch(loadUsersSuccess(res.users));
                dispatch(loadImagesSuccess(res.images));
            })
            .catch(error => {throw(error)})
    };
}