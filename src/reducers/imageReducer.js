import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function imageReducer(state = initialState.images, action) {
    switch(action.type) {
        case types.LOAD_IMAGES_SUCCESS:
            return action.images
        default: 
            return state;
    }
}