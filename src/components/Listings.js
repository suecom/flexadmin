import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from "react-router-dom";
import DataTable from 'react-data-table-component';

const columns = ((clickTransactions, clickReviews) => [
    {
        name: 'Title',
        selector: 'attributes.title',
        sortable: true,
        maxWidth: '150px',
    },
    {
        name: 'Make',
        selector: 'attributes.publicData.make',
        sortable: true,
        compact: true,
        maxWidth: '100px'
    },
    {
        name: 'Model',
        selector: 'attributes.publicData.model',
        sortable: true,
        compact: true,
        width: '100px',
    },
    {
        name: 'Owner',
        selector: 'email',
        sortable: true,
        compact: true,
    },
    {
        name: 'Enquiries',
        selector: 'enquire',
        sortable: true,
        width: '70px',
        compact: false,
        cell: row => <button className="btn btn-xs btn-block btn-primary" onClick={clickTransactions} value={row.id.uuid}>{row.enquire}</button>,
        ignoreRowClick: true,
    },
    {
        name: 'Rented',
        selector: 'rentals',
        sortable: true,
        width: '70px',
        compact: false,
        cell: row => <button className="btn btn-xs btn-block btn-primary" onClick={clickTransactions} value={row.id.uuid}>{row.rentals}</button>,
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

const Listings = ({ filterText, setFilterText }) => {
    const location = useLocation();
    const history = useHistory();
    const users = useSelector(state => state.users);
    const listings = useSelector(state => state.listings);
    const transactions = useSelector(state => state.transactions);
    const reviews = useSelector(state => state.reviews);
    const CompletedTransitions = ['transition/review-2-by-customer','transition/review-2-by-provider','transition/complete','transition/review-1-by-provider','transition/review-1-by-customer','transition/expire-customer-review-period','transition/expire-review-period'];
    const EnquiryTransitions = ['transition/request-payment','transition/request-payment-after-enquiry','transition/expire-payment','transition/decline','transition/expire'];
    
    function filterListing(listing) {
        return (listing.email.toLowerCase().includes(filterText.toLowerCase()) ||
                listing.attributes.publicData.make.toLowerCase().includes(filterText.toLowerCase()) ||
                listing.attributes.publicData.model.toLowerCase().includes(filterText.toLowerCase()));
    }

    function clickReviews(e)  {
        const listing = listings.filter(listing => listing.id.uuid === e.target.value);
        
        // This set the state for this location
        history.replace(location.pathname, { filterText: filterText });

        // This then redirects using the query to update filterText
        history.push('/reviews?search=' + listing[0].email);
    }

    function clickTransactions(e)  {
        const listing = listings.filter(listing => listing.id.uuid === e.target.value);
        
        // This set the state for this location
        history.replace(location.pathname, { filterText: filterText });

        // This then redirects using the query to update filterText
        history.push('/transactions?search=' + listing[0].email);
    }
    
    useEffect(() => {
        // Update the search filter according to router
        if(location.search.indexOf('search') !== -1) {
            setFilterText(location.search.substr(location.search.indexOf('=')+1));
        }
        else if(location.state !== null && location.state.filterText !== undefined) {
            setFilterText(location.state.filterText);
        } 
    }, [location, setFilterText])

    listings.forEach(listing => {
        listing.email = users.filter(user => listing.relationships.author.data.id.uuid === user.id.uuid)[0].attributes.email;
        listing.enquire = transactions.filter(transaction => transaction.relationships.listing.data.id.uuid === listing.id.uuid &&
                                                EnquiryTransitions.includes(transaction.attributes.lastTransition)).length;
        listing.rentals = transactions.filter(transaction => transaction.relationships.listing.data.id.uuid === listing.id.uuid &&
                                                CompletedTransitions.includes(transaction.attributes.lastTransition)).length;
        listing.reviews = reviews.filter(review => review.relationships.listing.data.id.uuid === listing.id.uuid &&
                                                review.relationships.subject.data.id.uuid === listing.relationships.author.data.id.uuid).length;
    })

    return (
        <div className="animated fadeIn  ">
            <DataTable
                title = 'Listings'
                columns = { columns(clickTransactions, clickReviews) }
                data = { listings.filter(listing => filterListing(listing)) }
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

export default Listings;