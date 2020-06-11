import React, { useEffect, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from "react-router-dom";
import DataTable from 'react-data-table-component';
import Mark from 'mark.js';

import Editor from './Editor.js';

const Listings = ({ filterText, setFilterText }) => {
    const location = useLocation();
    const history = useHistory();
    const users = useSelector(state => state.users);
    const listings = useSelector(state => state.listings);
    const transactions = useSelector(state => state.transactions);
    const reviews = useSelector(state => state.reviews);
    const CompletedTransitions = ['transition/review-2-by-customer','transition/review-2-by-provider','transition/complete','transition/review-1-by-provider','transition/review-1-by-customer','transition/expire-customer-review-period','transition/expire-review-period'];
    const EnquiryTransitions = ['transition/request-payment','transition/request-payment-after-enquiry','transition/expire-payment','transition/decline','transition/expire'];
    const customStyles = {
        headCells: {
            style: {
                fontWeight: 'bold',
            },
        }
    };

    const clickReviews = useCallback((e) => {
        var searchStr = '';
        const listing = listings.filter(listing => listing.id.uuid === e.target.value);
        const revs = reviews.filter(review => review.relationships.listing.data.id.uuid === listing[0].id.uuid &&
                                                    review.relationships.subject.data.id.uuid === listing[0].relationships.author.data.id.uuid);
        
        for(const rev of revs) {
            searchStr = searchStr + rev.id.uuid.substr(rev.id.uuid.lastIndexOf('-')+1,) + ',';
        }
        
        // This set the state for this location
        history.replace(location.pathname, { filterText: filterText });

        // This then redirects using the query to update filterText
        history.push('/reviews?search=' + searchStr);
    }, [ listings, reviews, filterText, history, location.pathname ])

    const clickEnquiries = useCallback((e) => {
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
    }, [ listings, transactions, EnquiryTransitions, filterText, history, location.pathname ])

    const clickRented = useCallback((e) => {
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
    }, [ listings, transactions, CompletedTransitions, history, filterText, location.pathname ])

    const clickUser = useCallback((e) => {
        const user = users.filter(user => user.id.uuid === e.target.rel);
        
        // This set the state for this location
        history.replace(location.pathname, { filterText: filterText });

        // This then redirects using the query to update filterText
        history.push('/users?search=' + user[0].attributes.email);
    }, [ users, history, filterText, location.pathname ])

    const columns = useMemo(() => [
        {
            name: 'Posted',
            format: row => new Date(row.attributes.createdAt).toLocaleDateString(),
            selector: 'attributes.createdAt',
            sortable: true,
            width: '95px',
        },
        {
            name: 'Owner',
            cell: row => { return(<a type="button" href="!#" onClick={e => {e.preventDefault(); clickUser(e);}} rel={row.ownerId}>{row.owner}</a>) },
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
            selector: 'enquires',
            sortable: true,
            width: '70px',
            compact: false,
            cell: row => <button className="btn btn-xs btn-block btn-success" onClick={clickEnquiries} value={row.id.uuid} disabled={row.enquires===0}>{row.enquires}</button>,
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
            name: 'Reviews',
            selector: 'reviews',
            sortable: true,
            width: '70px',
            compact: false,
            cell: row => <button className="btn btn-xs btn-block btn-success" onClick={clickReviews} value={row.id.uuid} disabled={row.reviews===0}>{row.reviews}</button>,
            ignoreRowClick: true,
        },
    ], [ clickUser, clickReviews, clickRented, clickEnquiries ]);
    
    const filterListing = (listing) => {
        const terms = filterText.toLowerCase().split(',');
        var retVal = terms.length === 0 || terms[0].length === 0 ? true : false;

        for(var i = 0; i < terms.length && terms[i].length > 0 && retVal === false; i++) {
            retVal = listing.owner.toLowerCase().search(terms[i]) !== -1 ||
                listing.ownerEmail.toLowerCase().search(terms[i]) !== -1 ||
                listing.attributes.title.toLowerCase().search(terms[i]) !== -1 ||
                listing.attributes.publicData.make.toLowerCase().search(terms[i]) !== -1 ||
                listing.attributes.publicData.model.toLowerCase().search(terms[i]) !== -1 ||
                listing.id.uuid.toLowerCase().search(terms[i]) !== -1
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
        else if(location.state !== null && location.state.filterText !== undefined) {
            setFilterText(location.state.filterText);
            location.state = null;
        } 

        for(const term of filterText.split(',')) {
            instance.mark(term, { 
                'element': 'span', 
                'className': 'markGreen',              
            });
        }
    }) 

    const listingsPlus = useCallback(() => {
        listings.forEach(listing => {
            const u = users.filter(user => listing.relationships.author.data.id.uuid === user.id.uuid);
            
            if(u.length > 0) {
                listing.owner = u[0].attributes.profile.firstName + ' ' + u[0].attributes.profile.lastName;
                listing.ownerId = u[0].id.uuid;
                listing.ownerEmail = u[0].attributes.email;
            }
            
            const trans = transactions !== undefined ? transactions.filter(transaction => transaction.relationships.listing.data.id.uuid === listing.id.uuid) : [];
            listing.enquires = trans.filter(t => EnquiryTransitions.includes(t.attributes.lastTransition)).length;
            listing.rentals = trans.filter(t => CompletedTransitions.includes(t.attributes.lastTransition)).length;
            listing.reviews = 0;
            trans.forEach(t => {
                if(t.relationships.reviews !== undefined && t.relationships.reviews.data !== undefined && t.relationships.reviews.data !== null) {
                    t.relationships.reviews.data.forEach(r => {
                        const rev = reviews.filter(r2 => r.id.uuid === r2.id.uuid);

                        if(rev.length > 0 && rev[0].relationships.subject.data.id.uuid === listing.relationships.author.data.id.uuid) {
                            listing.reviews += 1;
                        }
                    })
                }
            })
        })

        return listings;
    }, [ users, listings, transactions, reviews, CompletedTransitions, EnquiryTransitions ])

    const data = useMemo(() => listingsPlus(), [ listingsPlus ]);

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
                customStyles = { customStyles }
                fixedHeader
                fixedHeaderScrollHeight = '85vh'
                noHeader 
                defaultSortField = 'attributes.createdAt' 
                defaultSortAsc = { false }      
                expandableRows
                expandableRowsComponent={<Editor validSchema={'listing'} />}         
            />
        </div>
    )
}

export default Listings;