import React, { useEffect, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from "react-router-dom";
import DataTable from 'react-data-table-component';
import Mark from 'mark.js';

import Editor from './Editor.js';

var formatter = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
});

const Transactions = ({ filterText, setFilterText }) => {
    const location = useLocation();
    const history = useHistory();
    const transactions = useSelector(state => state.transactions);
    const users = useSelector(state => state.users);
    const listings = useSelector(state => state.listings); 
    const transitions = [
        { tran: 'transition/review-2-by-customer', lab: 'Complete' },
        { tran: 'transition/review-2-by-provider', lab: 'Complete' },
        { tran: 'transition/complete', lab: 'Complete' },
        { tran: 'transition/review-1-by-provider', lab: 'Complete' },
        { tran: 'transition/review-1-by-customer', lab: 'Complete' },
        { tran: 'transition/expire-customer-review-period', lab: 'Complete' },
        { tran: 'transition/expire-review-period', lab: 'Complete' },
        { tran: 'transition/enquire', lab: 'Enquire' },
        { tran: 'transition/request-payment', lab: 'Enquire' },
        { tran: 'transition/request-payment-after-enquiry', lab: 'Enquire' },
        { tran: 'transition/confirm-payment', lab: 'Enquire' },
        { tran: 'transition/accept', lab: 'Pending' },
        { tran: 'transition/cancel', lab: 'Decline' },
        { tran: 'transition/expire-payment', lab: 'Decline' },
        { tran: 'transition/decline', lab: 'Decline' },
        { tran: 'transition/expire', lab: 'Decline' } ];
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

    const clickUser = useCallback((e) =>  {
        const user = users.filter(user => user.id.uuid === e.target.rel);
        
        // This set the state for this location
        history.replace(location.pathname, { filterText: filterText });

        // This then redirects using the query to update filterText
        history.push('/users?search=' + user[0].attributes.email);
    }, [ users, history, filterText, location.pathname ])

    const clickListing = useCallback((e) => {
        const listing = listings.filter(listing => listing.id.uuid === e.target.rel);
        
        // This set the state for this location
        history.replace(location.pathname, { filterText: filterText });

        // This then redirects using the query to update filterText
        history.push('/listings?search=' + listing[0].attributes.title);
    }, [ listings, history, filterText, location.pathname ])

    const clickMessages = useCallback((e) => {
        var searchStr = '';
        const trans = transactions.filter(transaction => transaction.id.uuid === e.target.value);
        
        for(const mess of trans[0].relationships.messages.data) {
            searchStr = searchStr + mess.id.uuid.substr(mess.id.uuid.lastIndexOf('-')+1,) + ',';
        }

        // This set the state for this location
        history.replace(location.pathname, { filterText: filterText });

        // This then redirects using the query to update filterText
        history.push('/messages?search=' + searchStr);
    }, [ transactions, history, filterText, location.pathname ])

    const clickReviews = useCallback((e) => {
        var searchStr = '';
        const trans = transactions.filter(transaction => transaction.id.uuid === e.target.value);
        
        for(const rev of trans[0].relationships.reviews.data) {
            searchStr = searchStr + rev.id.uuid.substr(rev.id.uuid.lastIndexOf('-')+1,) + ',';
        }
        
        // This set the state for this location
        history.replace(location.pathname, { filterText: filterText });

        // This then redirects using the query to update filterText
        history.push('/reviews?search=' + searchStr);
    }, [ transactions, history, filterText, location.pathname ])

    const columns = useMemo(() => [
        {
            name: 'On',
            format: row => new Date(row.attributes.lastTransitionedAt).toLocaleDateString(),
            selector: 'attributes.createdAt',
            sortable: true,
            width: '95px',
        },
        {
            name: 'Provider',
            cell: row => { return(<a type="button" href="!#" onClick={e => {e.preventDefault(); clickUser(e);}} rel={row.providerId}>{row.provider}</a>) },
            selector: 'provider',
            sortable: true,
            compact: true,
        },
        {
            name: 'Customer',
            cell: row => { return(<a type="button" href="!#" onClick={e => {e.preventDefault(); clickUser(e);}} rel={row.customerId}>{row.customer}</a>) },
            selector: 'customer',
            sortable: true,
            compact: true,
        },   
        {
            name: 'Regards',
            cell: row => { return(<a type="button" href="#!" onClick={e => {e.preventDefault(); clickListing(e);}} rel={row.listingId}>{row.listing}</a>) },
            selector: 'listing',
            sortable: true,
            compact: true,
        },
        {
            name: 'Status',
            selector: 'attributes.lastTransition',
            cell: row => {
                return transitions.filter(tran => tran.tran === row.attributes.lastTransition)[0].lab
            },
            sortable: true,
            width: '80px',
        },
        {
            name: 'Value',
            selector: 'attributes.payinTotal.amount',
            format: row => formatter.format(row.attributes.payinTotal.amount/100),
            sortable: true,
            right: true,
            width: '90px',
        }, 
        {
            name: 'Messages',
            selector: 'messages',
            sortable: true,
            width: '70px',
            compact: false,  
            cell: row => <button className="btn btn-xs btn-block btn-success" onClick={clickMessages} value={row.id.uuid} disabled={row.messages===0}>{row.messages}</button>,
            ignoreRowClick: true,
        },
        {
            name: 'Reviews',
            selector: 'reviews',
            sortable: true,
            width: '70px',
            compact: false,  
            cell: row => <button className="btn btn-xs btn-block btn-success" onClick={clickReviews} value={row.id.uuid} disabled={row.reviews===0}>{row.reviews}</button>,
            ignoreRowClick: true,
        },
    ], [ clickReviews, clickMessages, clickListing, clickUser, transitions ])
    
    const filterTransaction = (transaction) => {
        const terms = filterText.toLowerCase().split(',');
        var retVal = terms.length === 0 || terms[0].length === 0 ? true : false;

        for(var i = 0; i < terms.length && terms[i].length > 0 && retVal === false; i++) {
            retVal = transaction.provider.toLowerCase().search(terms[i]) !== -1 ||
                transaction.providerEmail.toLowerCase().search(terms[i]) !== -1 ||
                transaction.customer.toLowerCase().search(terms[i]) !== -1 ||
                transaction.customerEmail.toLowerCase().search(terms[i]) !== -1 ||
                transaction.listing.toLowerCase().search(terms[i]) !== -1 ||
                transaction.id.uuid.toLowerCase().search(terms[i]) !== -1
        }

        return retVal;
    }

    useEffect(() => {
        var instance = new Mark("div.animated");

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
  
        for(const term of filterText.split(',')) {
            instance.mark(term, { 
                'element': 'span', 
                'className': 'markGreen',              
            });
        }
    });

    const linkUUID = useCallback((entity, id) => {
        // This set the state for this location
        history.replace(location.pathname, { filterText: filterText });

        // This then redirects using the query to update filterText
        history.push('/' + entity + '?search=' + id.substr(id.lastIndexOf('-')+1,));
    }, [ filterText, history, location.pathname ])

    const transactionsPlus = useCallback(() => {
        var dispTrans = [];

        transactions.forEach(transaction => {
            const nt = Object.assign({}, transaction);

            const p = users.filter(user => transaction.relationships.provider.data.id.uuid === user.id.uuid);
            if(p.length > 0) {
                nt.provider = p[0].attributes.profile.firstName + ' ' + p[0].attributes.profile.lastName;
                nt.providerId = p[0].id.uuid;
                nt.providerEmail = p[0].attributes.email;
            }
            else {
                nt.provider = '<deleted>';
                nt.providerId = '0';
                nt.providerEmail = '';
            }

            const c = users.filter(user => transaction.relationships.customer.data.id.uuid === user.id.uuid);      
            if(c.length > 0) {
                nt.customer = c[0].attributes.profile.firstName + ' ' + c[0].attributes.profile.lastName;
                nt.customerId = c[0].id.uuid;
                nt.customerEmail = c[0].attributes.email;
            }
            else {
                nt.customer = '<deleted>';
                nt.customerId = '0';
                nt.customerEmail = '';
            }
            
            const l = listings.filter(listing => transaction.relationships.listing.data.id.uuid === listing.id.uuid);
            if(l.length > 0) {
                nt.listingId = l[0].id.uuid;  
                nt.listing = l[0].attributes.title;
            }
            else {
                nt.listingId = '0';  
                nt.listing = '<deleted>';
            }
            
            nt.reviews = transaction.relationships.reviews.data.length;
            nt.messages = transaction.relationships.messages.data.length;

            if(transaction.attributes.payinTotal === null) {
                nt.attributes.payinTotal = { amount: 0, currency: 'GBP' };
            }

            dispTrans.push(nt);
        })

        return dispTrans;
    }, [ transactions, listings, users ]);

    const data = useMemo(() => transactionsPlus(), [ transactionsPlus ])

    return (
        <div className="animated fadeIn">
            <DataTable
                title = 'Transactions'
                columns = { columns }
                data = { data.filter(transaction => filterTransaction(transaction)) }
                keyField = 'id.uuid'
                dense
                highlightOnHover
                pointerOnHover
                customStyles = { customStyles }
                fixedHeader
                fixedHeaderScrollHeight = '85vh'
                noHeader
                defaultSortField = 'attributes.createdAt' 
                defaultSortAsc = { false }  
                expandableRows
                expandableRowsComponent={<Editor validSchema={'transaction'} linkUUID={ linkUUID } />}  
                expandOnRowClicked                  
            />
        </div>
    )
}

export default Transactions;