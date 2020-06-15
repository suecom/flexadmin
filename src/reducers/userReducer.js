import * as types from '../actions/actionTypes';
import initialState from './initialState';

const newerThan = (n, o) => {
    const s1 = JSON.stringify(n);
    const s2 = JSON.stringify(o);

    return s1 !== s2;
}

const mergeUsers = (now, added) => {
    var newUsers = [];

    added.forEach(user => {
        const exist = now.filter(u => u.id.uuid === user.id.uuid);

        if(exist.length === 0) {
            newUsers.push(user)
        }
        else {
            if (newerThan(user, exist[0])) {
                // Remove existing item
                now = now.filter(u => u.id.uuid !== user.id.uuid)

                // And add updated one to new list
                newUsers.push(user);
            }
        }
    })

    return newUsers.length === 0 ? now : newUsers.concat(now)
}

export default function userReducer(state = initialState.users, action) {
    switch(action.type) {
        case types.LOAD_USERS_SUCCESS:
            return action.users;
        case types.UPDATE_USERS_SUCCESS:
            return mergeUsers(state, action.users);
        default: 
            return state;
    }
}