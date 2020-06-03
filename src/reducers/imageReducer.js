import * as types from '../actions/actionTypes';
import initialState from './initialState';

function uniqBy(a, key) {
    return [
        ...new Map(
            a.map(x => [key(x), x])
        ).values()
    ]
}

export default function imageReducer(state = initialState.images, action) {
    switch(action.type) {
        case types.LOAD_IMAGES_SUCCESS:
            const u = uniqBy(state.concat(action.images), x => x.id.uuid)
            return u;
        default: 
            return state;
    }
}