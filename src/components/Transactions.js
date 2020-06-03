import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from "react-router-dom";
import DataTable from 'react-data-table-component';
import Mark from 'mark.js';

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
    const reviews = useSelector(state => state.reviews);
    const messages = useSelector(state => state.messages);
    const columns = [
        {
            name: 'On',
            format: row => new Date(row.attributes.lastTransitionedAt).toLocaleDateString(),
            selector: 'attributes.createdAt',
            sortable: true,
            width: '95px',
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
            name: 'Regards',
            cell: row => { return(<a type="button" onClick={clickListing} rel={row.listingId}>{row.listing}</a>) },
            selector: 'listing',
            sortable: true,
            compact: true,
        },
        {
            name: 'Value',
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
    ];
    const customStyles = {
        headCells: {
            style: {
                fontWeight: 'bold',
            },
        },
    }
    
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

    const clickUser = (e) =>  {
        const user = users.filter(user => user.id.uuid === e.target.rel);
        
        // This set the state for this location
        history.replace(location.pathname, { filterText: filterText });

        // This then redirects using the query to update filterText
        history.push('/users?search=' + user[0].attributes.email);
    }

    const clickListing = (e) => {
        const listing = listings.filter(listing => listing.id.uuid === e.target.rel);
        
        // This set the state for this location
        history.replace(location.pathname, { filterText: filterText });

        // This then redirects using the query to update filterText
        history.push('/listings?search=' + listing[0].attributes.title);
    }

    const clickMessages = (e) => {
        var searchStr = '';
        const trans = transactions.filter(transaction => transaction.id.uuid === e.target.value);
        
        for(const mess of trans[0].relationships.messages.data) {
            searchStr = searchStr + mess.id.uuid.substr(mess.id.uuid.lastIndexOf('-')+1,) + ',';
        }

        // This set the state for this location
        history.replace(location.pathname, { filterText: filterText });

        // This then redirects using the query to update filterText
        history.push('/messages?search=' + searchStr);
    }

    const clickReviews = (e) => {
        var searchStr = '';
        const trans = transactions.filter(transaction => transaction.id.uuid === e.target.value);
        
        for(const rev of trans[0].relationships.reviews.data) {
            searchStr = searchStr + rev.id.uuid.substr(rev.id.uuid.lastIndexOf('-')+1,) + ',';
        }
        
        // This set the state for this location
        history.replace(location.pathname, { filterText: filterText });

        // This then redirects using the query to update filterText
        history.push('/reviews?search=' + searchStr);
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
    });

    const transactionsPlus = () => {
        transactions.forEach(transaction => {
            const p = users.filter(user => transaction.relationships.provider.data.id.uuid === user.id.uuid);

            if(p.length > 0) {
                transaction.provider = p[0].attributes.profile.firstName + ' ' + p[0].attributes.profile.lastName;
                transaction.providerId = p[0].id.uuid;
                transaction.providerEmail = p[0].attributes.email;
            }
            else {
                transaction.provider = '<deleted>';
                transaction.providerId = '0';
                transaction.providerEmail = '';
            }

            const c = users.filter(user => transaction.relationships.customer.data.id.uuid === user.id.uuid);
            
            if(c.length > 0) {
                transaction.customer = c[0].attributes.profile.firstName + ' ' + c[0].attributes.profile.lastName;
                transaction.customerId = c[0].id.uuid;
                transaction.customerEmail = c[0].attributes.email;
            }
            else {
                transaction.customer = '<deleted>';
                transaction.customerId = '0';
                transaction.customerEmail = '';
            }
            
            const l = listings.filter(listing => transaction.relationships.listing.data.id.uuid === listing.id.uuid);
            if(l.length > 0) {
                transaction.listingId = l[0].id.uuid;  
                transaction.listing = l[0].attributes.title;
            }
            else {
                transaction.listingId = '0';  
                transaction.listing = '<deleted>';
            }
            
            transaction.reviews = transaction.relationships.reviews.data.length;
            transaction.messages = transaction.relationships.messages.data.length;

            if(transaction.attributes.payinTotal === null) {
                transaction.attributes.payinTotal = { amount: 0, currency: 'GBP' };
            }
        })

        return transactions;
    };

    const data = useMemo(() => transactionsPlus(), [transactions, listings, users, messages, reviews])

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
            />
        </div>
    )
}

export default Transactions;