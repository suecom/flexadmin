import * as types from '../actions/actionTypes';
import initialState from './initialState';

const mergeImages = (now, added) => {
    var newImages = [];

    added.forEach(image => {
        const exist = now.filter(i => i.id.uuid === image.id.uuid);

        if(exist.length === 0) {
            newImages.push(image)
        }
    })

    return newImages === 0 ? now : newImages.concat(now)
}

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
            return uniqBy(state.concat(action.images), x => x.id.uuid);
        case types.UPDATE_IMAGES_SUCCESS:
            return mergeImages(state, action.images)
        default: 
            return state;
    }
}