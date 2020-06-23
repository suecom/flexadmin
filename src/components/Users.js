import React, { useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from "react-router-dom";
import DataTable from 'react-data-table-component';
import Mark from 'mark.js';

import Editor from './Editor.js';
import { loadUsersSuccess } from '../actions/userActions.js'

const Users = ({ filterText, setFilterText }) => {
    const location = useLocation();
    const history = useHistory();
    const dispatch = useDispatch()
    const users = useSelector(state => state.users);
    const listings = useSelector(state => state.listings);
    const transactions = useSelector(state => state.transactions);
    const reviews = useSelector(state => state.reviews);
    const CompletedTransitions = [
        'transition/review-2-by-customer',
        'transition/review-2-by-provider',
        'transition/complete',
        'transition/review-1-by-provider',
        'transition/review-1-by-customer',
        'transition/expire-customer-review-period',
        'transition/expire-review-period'];
    const customStyles = {
        headCells: {
            style: {
                fontSize: '12px',
                paddingLeft: '6px',
                fontWeight: 'bold',
            },
        },
        expanderButton: {
            style: {     
                paddingRight: '0px',   
                paddingLeft: '0px',     
                svg: {
                    paddingLeft: '0px',
                    paddingRight: '0px',
                    margin: '0px',
                },
            },
        },
        expanderCell: {
            style: {
                flex: '0 0 24px',
                paddingRight: '0px',
                paddingLeft: '2px',
            },
        },
        cells: {
            style: {
                paddingLeft: '5px',
                fontWeight: 'lighter',
                
            },
        },
    };

    const clickRented = useCallback((e) => {
        var searchStr = '';
        const user = users.filter(user => user.id.uuid === e.target.value);
        const enquiries = transactions.filter(transaction => transaction.relationships.customer.data.id.uuid === user[0].id.uuid &&
                                                            CompletedTransitions.includes(transaction.attributes.lastTransition));

        for(const enq of enquiries) {
            searchStr = searchStr + enq.id.uuid.substr(enq.id.uuid.lastIndexOf('-')+1,) + ',';
        }
        
        // This set the state for this location
        history.replace(location.pathname, { filterText: filterText });

        // This then redirects using the query to update filterText
        history.push('/transactions?search=' + searchStr);
    }, [ users, transactions, CompletedTransitions, filterText, history, location.pathname ])

    const clickListing = useCallback((e) =>  {
        const user = users.filter(user => user.id.uuid === e.target.value);
        
        // This set the state for this location
        history.replace(location.pathname, { filterText: filterText });

        // This then redirects using the query to update filterText
        history.push('/listings?search=' + user[0].attributes.email);
    }, [ users, history, filterText, location.pathname ])

    const clickReviews = useCallback((e) => {
        var searchStr = '';
        const user = users.filter(user => user.id.uuid === e.target.value);
        const revs = reviews.filter(review => review.relationships.subject.data.id.uuid === user[0].id.uuid)
        
        for(const rev of revs) {
            searchStr = searchStr + rev.id.uuid.substr(rev.id.uuid.lastIndexOf('-')+1,) + ',';
        }
        
        // This set the state for this location
        history.replace(location.pathname, { filterText: filterText });

        // This then redirects using the query to update filterText
        history.push('/reviews?search=' + searchStr);
    }, [ users, reviews, history, filterText, location.pathname ])

    const clickProvided = useCallback((e) => {
        var searchStr = '';
        const user = users.filter(user => user.id.uuid === e.target.value);
        const enquiries = transactions.filter(transaction => transaction.relationships.provider.data.id.uuid === user[0].id.uuid &&
                                                            CompletedTransitions.includes(transaction.attributes.lastTransition));

        for(const enq of enquiries) {
            searchStr = searchStr + enq.id.uuid.substr(enq.id.uuid.lastIndexOf('-')+1,) + ',';
        }
        
        // This set the state for this location
        history.replace(location.pathname, { filterText: filterText });

        // This then redirects using the query to update filterText
        history.push('/transactions?search=' + searchStr);
    },[ users, transactions, CompletedTransitions, filterText, history, location.pathname ])

    const columns = useMemo(() => [
        {
            name: 'Enrolled',
            format: row => typeof(row.attributes.createdAt) == 'string' ? row.attributes.createdAt : new Date(row.attributes.createdAt).toLocaleDateString(),
            selector: 'attributes.createdAt',
            sortable: true,
            width: '100px',
        }, 
        {
            name: 'Name',
            format: row => row.attributes.profile.firstName + ' ' + row.attributes.profile.lastName,
            selector: 'attributes.profile.firstName',
            sortable: true,
            compact: true,
            maxWidth: '150px'
        },
        {
            name: 'Email',
            cell: row => { const hrefconst = 'mailto:' + row.attributes.email;
                            return (<a href={hrefconst}>{row.attributes.email}</a>) },
        },  
        {
            name: 'Clients',
            selector: 'clients',
            sortable: true,
            width: '70px',
            compact: false,
            cell: row => <button className="btn btn-xs btn-block btn-success" onClick={clickProvided} value={row.id.uuid} disabled={row.clients===0}>{row.clients}</button>,
            ignoreRowClick: true,
        },  
        {
            name: 'Rented',
            selector: 'rentals',
            sortable: true,
            width: '70px',
            compact: false,
            cell: row => <button className="btn btn-xs btn-block btn-success" onClick={clickRented} value={row.id.uuid} disabled={row.rentals===0}>{row.rentals}</button>,
            ignoreRowClick: true,
        },
        {
            name: 'Listings',
            selector: 'listings',
            sortable: true,
            width: '70px',
            compact: false,
            cell: row => <button className="btn btn-xs btn-block btn-success" onClick={clickListing} value={row.id.uuid} disabled={row.listings===0}>{row.listings}</button>,
            ignoreRowClick: true,
        },
        {
            name: 'Reviews',
            selector: 'reviews',
            sortable: true,
            width: '70px',
            compact: false,  
            cell: row => <button className="btn btn-xs btn-block btn-success" onClick={clickReviews} value={row.id.uuid} disabled={row.reviews===0}>{row.reviews}</button>,
            //ignoreRowClick: true,
        },
    ], [ clickListing, clickReviews, clickRented, clickProvided ]);
  
    const filterUser = (user) => {
        const terms = filterText.toLowerCase().split(',');
        var retVal = terms.length === 0 || terms[0].length === 0 ? true : false;

        for(var i = 0; i < terms.length && terms[i].length > 0 && retVal === false; i++) {
            retVal = user.attributes.email.toLowerCase().search(terms[i]) !== -1 ||
                user.attributes.profile.firstName.toLowerCase().search(terms[i]) !== -1 ||
                user.attributes.profile.lastName.toLowerCase().search(terms[i]) !== -1 ||
                user.id.uuid.toLowerCase().search(terms[i]) !== -1
        }

        return retVal;
    }

    useEffect(() => {
        var instance = new Mark("div.animated");

        for(const term of filterText.split(',')) {
            instance.mark(term, { 
                'element': 'span', 
                'className': 'markGreen',              
            });
        }
    }, [filterText])

    useEffect(() => {
        // Update the search filter according to router
        if(location.search.indexOf('search') !== -1) {
            setFilterText(location.search.substr(location.search.indexOf('=')+1));
            location.search = '';
            location.state = null;
        }
        else if(location.state !== undefined && location.state !== null && location.state.filterText !== undefined) {
            setFilterText(location.state.filterText);
            location.state = null;
        } 
        else {
            // Called when navigating manually (not via link)
            // If no documents selected with current filterText then clear
            if(filterText.length > 0 && data.filter(user => filterUser(user)).length === 0) {
                setFilterText('')
            }
        }
    // eslint-disable-next-line
    }, [ location.search, location.state, setFilterText, filterUser ])

    const linkUUID = useCallback((entity, id) => {
        // This set the state for this location
        history.replace(location.pathname, { filterText: filterText });

        // This then redirects using the query to update filterText
        history.push('/' + entity + '?search=' + id.substr(id.lastIndexOf('-')+1,));
    }, [ filterText, history, location.pathname ])

    const updateRow = useCallback((row) => {
        var newUsers = [];

        users.forEach(user => {
            if(user.id.uuid === row.id.uuid) {
                newUsers.push(row)
            }
            else {
                newUsers.push(user);
            }
        })

        dispatch(loadUsersSuccess(newUsers))
    }, [ users, dispatch ])

    const usersPlus = useCallback(() => {
        var dispUsers = [];

        users.forEach(user => {
            var u = Object.assign({}, user);
            
            //u.keyField = user.id.uuid;
            u.listings = listings.filter(listing => listing.relationships.author.data.id.uuid === user.id.uuid).length;
            u.clients = transactions.filter(transaction => transaction.relationships.provider.data.id.uuid === user.id.uuid &&
                                        CompletedTransitions.includes(transaction.attributes.lastTransition)).length;
            u.rentals = transactions.filter(transaction => transaction.relationships.customer.data.id.uuid === user.id.uuid &&
                                        CompletedTransitions.includes(transaction.attributes.lastTransition)).length;
            u.reviews = reviews.filter(review => review.relationships.subject.data.id.uuid === user.id.uuid).length;

            dispUsers.push(u)
        })

        return dispUsers;
    }, [ users, listings, transactions, reviews, CompletedTransitions ])

    const data = useMemo(() => usersPlus(), [ usersPlus ])

    return (
        <div className="animated fadeIn">
            <DataTable
                title = 'Users'
                columns = { columns }
                data = { data.filter(user => filterUser(user)) }
                keyField = 'id.uuid'
                dense
                highlightOnHover
                pointerOnHover
                customStyles = { customStyles }
                fixedHeader
                fixedHeaderScrollHeight = "85vh"
                noHeader  
                defaultSortField = 'attributes.createdAt' 
                defaultSortAsc = { false }
                expandableRows
                expandableRowsComponent={<Editor validSchema={ 'user' } updateRow={ updateRow } linkUUID={ linkUUID } />}  
                expandOnRowClicked
            />
        </div>
    )
}

export default Users;