import * as types from './actionTypes';
import listingApi from '../api/listingApi';

export function loadListingsSuccess(listings) {
    return {type: types.LOAD_LISTINGS_SUCCESS, listings};
}

export function loadListings() {
    return function(dispatch) {
        const api = new listingApi();

        return api.getListings()
            .then(listings => dispatch(loadListingsSuccess(listings)))
            .catch(error => { throw(error) });
    };
}