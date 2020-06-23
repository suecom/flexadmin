import * as types from '../actions/actionTypes';
import initialState from './initialState';

const mergeReviews = (now, added) => {
    var newRev = [];

    if(added != null) {
        added.forEach(rev => {
            const exist = now.filter(r => r.id.uuid === rev.id.uuid);

            if(exist.length === 0) {
                newRev.push(rev)
            }
        })
    }

    return newRev.length === 0 ? now : newRev.concat(now)
}

export default function reviewReducer(state = initialState.reviews, action) {
    switch(action.type) {
        case types.LOAD_REVIEWS_SUCCESS:
            return action.reviews;
        case types.UPDATE_REVIEWS_SUCCESS:
            return mergeReviews(state, action.reviews);
        default: 
            return state;
    }
}