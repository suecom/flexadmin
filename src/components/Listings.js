import React, { useEffect, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from "react-router-dom";
import DataTable from 'react-data-table-component';
import Mark from 'mark.js';

const Listings = ({ filterText, setFilterText }) => {
    const location = useLocation();
    const history = useHistory();
    const users = useSelector(state => state.users);
    const listings = useSelector(state => state.listings);
    const transactions = useSelector(state => state.transactions);
    const reviews = useSelector(state => state.reviews);
    const CompletedTransitions = ['transition/review-2-by-customer','transition/review-2-by-provider','transition/complete','transition/review-1-by-provider','transition/review-1-by-customer','transition/expire-customer-review-period','transition/expire-review-period'];
    const EnquiryTransitions = ['transition/request-payment','transition/request-payment-after-enquiry','transition/expire-payment','transition/decline','transition/expire'];
    const columns = [
        {
            name: 'Posted',
            format: row => new Date(row.attributes.createdAt).toLocaleDateString(),
            selector: 'attributes.createdAt',
            sortable: true,
            width: '95px',
        },
        {
            name: 'Owner',
            cell: row => { return(<a type="button" onClick={clickUser} rel={row.ownerId}>{row.owner}</a>) },
            selector: 'owner',
            sortable: true,
            compact: true,
            width: '120px',
        },  
        {
            name: 'Title',
            selector: 'attributes.title',
            sortable: true,
            compact: true,
            width: '120px',
        }, 
        {
            name: 'Make',
            selector: 'attributes.publicData.make',
            sortable: true,
            compact: true,
            width: '100px'
        },
        {
            name: 'Model',
            selector: 'attributes.publicData.model',
            sortable: true,
            compact: true,
            allowOverflow: true,
            style: { 'width': '50px', 'overflow': 'hidden' },
        },   
        {
            name: 'Enquiries',
            selector: 'enquire',
            sortable: true,
            width: '70px',
            compact: false,
            cell: row => <button className="btn btn-xs btn-block btn-primary" onClick={clickEnquiries} value={row.id.uuid}>{row.enquire}</button>,
            ignoreRowClick: true,
        },
        {
            name: 'Rented',
            selector: 'rentals',
            sortable: true,
            width: '70px',
            compact: false,
            cell: row => <button className="btn btn-xs btn-block btn-primary" onClick={clickRented} value={row.id.uuid}>{row.rentals}</button>,
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
    ];

    const filterListing = (listing) => {
        const terms = filterText.toLowerCase().split(',');
        var retVal = terms.length === 0 || terms[0].length === 0 ? true : false;

        for(var i = 0; i < terms.length && terms[i].length > 0 && retVal === false; i++) {
            retVal = listing.owner.toLowerCase().search(terms[i]) !== -1 ||
                listing.ownerEmail.toLowerCase().search(terms[i]) !== -1 ||
                listing.attributes.title.toLowerCase().search(terms[i]) !== -1 ||
                listing.attributes.publicData.make.toLowerCase().search(terms[i]) !== -1 ||
                listing.attributes.publicData.model.toLowerCase().search(terms[i]) !== -1
        }

        return retVal;
    }

    const clickReviews = (e) => {
        const listing = listings.filter(listing => listing.id.uuid === e.target.value);
        
        // This set the state for this location
        history.replace(location.pathname, { filterText: filterText });

        // This then redirects using the query to update filterText
        history.push('/reviews?search=' + listing[0].email);
    }

    const clickEnquiries = (e) => {
        var searchStr = '';
        const listing = listings.filter(listing => listing.id.uuid === e.target.value);
        const enquiries = transactions.filter(transaction => transaction.relationships.listing.data.id.uuid === listing[0].id.uuid &&
                                                            EnquiryTransitions.includes(transaction.attributes.lastTransition));
        
        for(const enq of enquiries) {
            searchStr = searchStr + enq.id.uuid.substr(enq.id.uuid.lastIndexOf('-')+1,) + ',';
        }

        // This set the state for this location
        history.replace(location.pathname, { filterText: filterText });

        // This then redirects using the query to update filterText
        history.push('/transactions?search=' + searchStr);
    }

    const clickRented = (e) => {
        var searchStr = '';
        const listing = listings.filter(listing => listing.id.uuid === e.target.value);
        const enquiries = transactions.filter(transaction => transaction.relationships.listing.data.id.uuid === listing[0].id.uuid &&
                                                            CompletedTransitions.includes(transaction.attributes.lastTransition));
        
        for(const enq of enquiries) {
            searchStr = searchStr + enq.id.uuid.substr(enq.id.uuid.lastIndexOf('-')+1,) + ',';
        }

        // This set the state for this location
        history.replace(location.pathname, { filterText: filterText });

        // This then redirects using the query to update filterText
        history.push('/transactions?search=' + searchStr);
    }

    const clickUser = (e) => {
        const user = users.filter(user => user.id.uuid === e.target.rel);
        
        // This set the state for this location
        history.replace(location.pathname, { filterText: filterText });

        // This then redirects using the query to update filterText
        history.push('/users?search=' + user[0].attributes.email);
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
            location.state = null;
        } 

        for(const term of filterText.split(',')) {
            instance.mark(term, { 
                'element': 'span', 
                'className': 'markYellow',              
            });
        }
    }) 

    const listingsPlus = () => {
        listings.forEach(listing => {
            const u = users.filter(user => listing.relationships.author.data.id.uuid === user.id.uuid);
            listing.owner = u[0].attributes.profile.firstName + ' ' + u[0].attributes.profile.lastName;
            listing.ownerId = u[0].id.uuid;
            listing.ownerEmail = u[0].attributes.email;
            
            listing.enquire = transactions.filter(transaction => transaction.relationships.listing.data.id.uuid === listing.id.uuid &&
                                                    EnquiryTransitions.includes(transaction.attributes.lastTransition)).length;
            listing.rentals = transactions.filter(transaction => transaction.relationships.listing.data.id.uuid === listing.id.uuid &&
                                                    CompletedTransitions.includes(transaction.attributes.lastTransition)).length;
            listing.reviews = reviews.filter(review => review.relationships.listing.data.id.uuid === listing.id.uuid &&
                                                    review.relationships.subject.data.id.uuid === listing.relationships.author.data.id.uuid).length;
        })

        return listings;
    }

    const data = useMemo(() => listingsPlus(), [listings, users, transactions, reviews]);

    return (
        <div className="animated fadeIn">
            <DataTable
                title = 'Listings'
                columns = { columns }
                data = { data.filter(listing => filterListing(listing)) }
                keyField = 'id.uuid'
                dense
                highlightOnHover
                pointerOnHover
                fixedHeader
                fixedHeaderScrollHeight = "85vh"
                noHeader           
            />
        </div>
    )
}

export default Listings;