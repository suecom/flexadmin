import * as types from './actionTypes';
import listingApi from '../api/listingApi';

import { loadImagesSuccess } from './imageActions';

export function loadListingsSuccess(listings) {
    return {type: types.LOAD_LISTINGS_SUCCESS, listings};
}

export function loadListings() {
    return function(dispatch) {
        const api = new listingApi();

        return api.getListings()
            .then(res => {
                dispatch(loadListingsSuccess(res.listings));
                dispatch(loadImagesSuccess(res.images));
            })
            .catch(error => { throw(error) });
    };
}