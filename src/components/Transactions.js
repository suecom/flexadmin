import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from "react-router-dom";
import DataTable from 'react-data-table-component';
import Mark from 'mark.js';

var formatter = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
});

const columns = ((clickUser, clickListing, clickMessages, clickReviews) => [
    {
        name: 'On',
        format: row => new Date(row.attributes.lastTransitionedAt).toLocaleDateString(),
        selector: 'attributes.lastTransitionedAt',
        sortable: true,
        width: '120px',
    },
    {
        name: 'Provider',
        cell: row => { return(<a type="button" onClick={clickUser} rel={row.providerId}>{row.provider}</a>) },
        selector: 'provider',
        sortable: true,
        compact: true,
    },
    {
        name: 'Customer',
        cell: row => { return(<a type="button" onClick={clickUser} rel={row.customerId}>{row.customer}</a>) },
        selector: 'customer',
        sortable: true,
        compact: true,
    },   
    {
        name: 'Car',
        cell: row => { return(<a type="button" onClick={clickListing} rel={row.listingId}>{row.listing}</a>) },
        selector: 'listing',
        sortable: true,
        compact: true,
    },
    {
        name: 'Amount',
        selector: 'attributes.payinTotal.amount',
        format: row => formatter.format(row.attributes.payinTotal.amount/100),
        sortable: true,
        right: true,
        width: '120px',
    }, 
    {
        name: 'Messages',
        selector: 'messages',
        sortable: true,
        width: '70px',
        compact: false,  
        cell: row => <button className="btn btn-xs btn-block btn-primary" onClick={clickMessages} value={row.id.uuid}>{row.messages}</button>,
        ignoreRowClick: true,
    },
    {
        name: 'Reviews',
        selector: 'reviews',
        sortable: true,
        width: '70px',
        compact: false,  
        cell: row => <button className="btn btn-xs btn-block btn-primary" onClick={clickReviews} value={row.id.uuid}>{row.reviews}</button>,
        ignoreRowClick: true,
    },
]);

const Transactions = ({ filterText, setFilterText }) => {
    const location = useLocation();
    const history = useHistory();
    const users = useSelector(state => state.users);
    const listings = useSelector(state => state.listings);
    const transactions = useSelector(state => state.transactions);
    const reviews = useSelector(state => state.reviews);
    const messages = useSelector(state => state.messages);
    const CompletedTransitions = ['transition/review-2-by-customer','transition/review-2-by-provider','transition/complete','transition/review-1-by-provider','transition/review-1-by-customer','transition/expire-customer-review-period','transition/expire-review-period'];
    const EnquiryTransitions = ['transition/request-payment','transition/request-payment-after-enquiry','transition/expire-payment','transition/decline','transition/expire'];
    
    function filterTransaction(transaction) {
        return (
            transaction.provider.toLowerCase().includes(filterText.toLowerCase()) ||
            transaction.providerEmail.toLowerCase().includes(filterText.toLowerCase()) ||
            transaction.customer.toLowerCase().includes(filterText.toLowerCase()) ||
            transaction.customerEmail.toLowerCase().includes(filterText.toLowerCase()) ||
            transaction.listing.toLowerCase().includes(filterText.toLowerCase())
        );
    }

    function clickUser(e)  {
        const user = users.filter(user => user.id.uuid === e.target.rel);
        
        // This set the state for this location
        history.replace(location.pathname, { filterText: filterText });

        // This then redirects using the query to update filterText
        history.push('/users?search=' + user[0].attributes.email);
    }

    function clickListing(e)  {
        const listing = listings.filter(listing => listing.id.uuid === e.target.rel);
        
        // This set the state for this location
        history.replace(location.pathname, { filterText: filterText });

        // This then redirects using the query to update filterText
        history.push('/listings?search=' + listing[0].attributes.title);
    }

    function clickMessages(e)  {
        const transaction = transactions.filter(transaction => transaction.id.uuid === e.target.value);
        
        // This set the state for this location
        history.replace(location.pathname, { filterText: filterText });

        // This then redirects using the query to update filterText
        history.push('/messages?search=' /*+ user[0].attributes.email*/);
    }

    function clickReviews(e)  {
        const transaction = transactions.filter(transaction => transaction.id.uuid === e.target.value);
        
        // This set the state for this location
        history.replace(location.pathname, { filterText: filterText });

        // This then redirects using the query to update filterText
        history.push('/reviews?search=' /*+ user[0].attributes.email*/);
    }

    useEffect(() => {
        var instance = new Mark("div.animated");

        // Update the search filter according to router
        if(location.search.indexOf('search') !== -1) {
            setFilterText(location.search.substr(location.search.indexOf('=')+1));
            location.search = '';
            location.state = null;
        }
        else if(location.state !== null && location.state.filterText !== undefined) {
            setFilterText(location.state.filterText);
        } 
  
        instance.mark(filterText, { 'element': 'span', 'className': 'markYellow', 'separateWordSearch': true });
    });

    transactions.forEach(transaction => {
        const p = users.filter(user => transaction.relationships.provider.data.id.uuid === user.id.uuid);
        transaction.provider = p[0].attributes.profile.firstName + ' ' + p[0].attributes.profile.lastName;
        transaction.providerId = p[0].id.uuid;
        transaction.providerEmail = p[0].attributes.email;

        const c = users.filter(user => transaction.relationships.customer.data.id.uuid === user.id.uuid);          
        transaction.customer = c[0].attributes.profile.firstName + ' ' + c[0].attributes.profile.lastName;
        transaction.customerId = c[0].id.uuid;
        transaction.customerEmail = c[0].attributes.email;
        
        const l =  listings.filter(listing => transaction.relationships.listing.data.id.uuid === listing.id.uuid);
        transaction.listing = l[0].attributes.title;
        transaction.listingId = l[0].id.uuid;  
        
        transaction.reviews = transaction.relationships.reviews.data.length;
        transaction.messages = transaction.relationships.messages.data.length;
    });

    

    return (
        <div className="animated fadeIn  ">
            <DataTable
                title = 'Transactions'
                columns = { columns(clickUser, clickListing, clickMessages, clickReviews) }
                data = { transactions.filter(transaction => filterTransaction(transaction)) }
                keyField = 'id.uuid'
                dense
                highlightOnHover
                pointerOnHover
                fixedHeader
                noHeader           
            />
        </div>
    )
}

export default Transactions;