import * as types from '../actions/actionTypes';
import initialState from './initialState';

const newerThan = (n, o) => {
    const s1 = JSON.stringify(n);
    const s2 = JSON.stringify(o);

    return s1 !== s2;
}

const mergeTransactions = (now, added) => {
    var newTrans = [];

    added.forEach(tran => {
        const exist = now.filter(t => t.id.uuid === tran.id.uuid);

        if(exist.length === 0) {
            newTrans.push(tran);
        }
        else {
            if (newerThan(tran, exist[0])) {
                // Remove existing item
                now = now.filter(t => t.id.uuid !== tran.id.uuid)

                // And add updated one to new list
                newTrans.push(tran);
            }
        }
    })

    return newTrans.length === 0 ? now : newTrans.concat(now)
}

export default function transactionReducer(state = initialState.transactions, action) {
    switch(action.type) {
        case types.LOAD_TRANSACTIONS_SUCCESS:
            return action.transactions;
        case types.UPDATE_TRANSACTIONS_SUCCESS:
            return mergeTransactions(state, action.transactions);
        default: 
            return state;
    }
}