import * as types from '../actions/actionTypes';
import initialState from './initialState';

const mergeMessages = (now, added) => {
    var newMes = [];

    if(added != null) {
        added.forEach(mes => {
            const exist = now.filter(m => m.id.uuid === mes.id.uuid);

            if(exist.length === 0) {
                newMes.push(mes)
            }
        })
    }

    return newMes.length === 0 ? now : newMes.concat(now)
}

export default function messageReducer(state = initialState.messages, action) {
    switch(action.type) {
        case types.LOAD_MESSAGES_SUCCESS:
            return action.messages;
        case types.UPDATE_MESSAGES_SUCCESS:
            return mergeMessages(state, action.messages);
        default: 
            return state;
    }
}