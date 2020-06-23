import * as types from '../actions/actionTypes';
import initialState from './initialState';

const newerThan = (n, o) => {
    const s1 = JSON.stringify(n);
    const s2 = JSON.stringify(o);

    return s1 !== s2;
}

const mergeListings = (now, added) => {
    var newLists = [];

    if(added != null) {
        added.forEach(list => {
            const exist = now.filter(l => l.id.uuid === list.id.uuid);

            if(exist.length === 0) {
                newLists.push(list)
            }
            else {
                if (newerThan(list, exist[0])) {
                    // Remove existing item
                    now = now.filter(l => l.id.uuid !== list.id.uuid)

                    // And add updated one to new list
                    newLists.push(list);
                }
            }
        })
    }

    return newLists.length === 0 ? now : newLists.concat(now)
}

export default function listingReducer(state = initialState.listings, action) {
    switch(action.type) {
        case types.LOAD_LISTINGS_SUCCESS:
            return action.listings;
        case types.UPDATE_LISTINGS_SUCCESS:
            return mergeListings(state, action.listings);
        default: 
            return state;
    }
}