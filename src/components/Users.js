import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from "react-router-dom";
import DataTable from 'react-data-table-component';

const columns = (clickHandler => [
    {
        name: 'Name',
        format: row => row.attributes.profile.firstName + ' ' + row.attributes.profile.lastName,
        selector: 'attributes.profile.firstName',
        sortable: true,
        maxWidth: '150px'
    },
    {
        name: 'Email',
        cell: row => { const hrefconst = 'mailto:' + row.attributes.email;
                        return (<a href={hrefconst}>{row.attributes.email}</a>) },
    },
    {
        name: 'Enrolled',
        format: row => new Date(row.attributes.createdAt).toLocaleDateString(),
        selector: 'attributes.createdAt',
        sortable: true,
        width: '120px',
    },
    {
        name: 'Clients',
        selector: 'clients',
        sortable: true,
        width: '70px',
        compact: false,
        cell: row => <button className="btn btn-xs btn-block btn-primary" onClick={clickHandler} value={row.id.uuid}>{row.clients}</button>,
        ignoreRowClick: true,
    },
    {
        name: 'Rented',
        selector: 'rentals',
        sortable: true,
        width: '70px',
        compact: false,
        cell: row => <button className="btn btn-xs btn-block btn-primary" onClick={clickHandler} value={row.id.uuid}>{row.rentals}</button>,
        ignoreRowClick: true,
    },
    {
        name: 'Listings',
        selector: 'listings',
        sortable: true,
        width: '70px',
        compact: false,
        cell: row => <button className="btn btn-xs btn-block btn-primary" onClick={clickHandler} value={row.id.uuid}>{row.listings}</button>,
        ignoreRowClick: true,
    },
    {
        name: 'Reviews',
        selector: 'reviews',
        sortable: true,
        width: '70px',
        compact: false,  
        cell: row => <button className="btn btn-xs btn-block btn-primary" onClick={clickHandler} value={row.id.uuid}>{row.reviews}</button>,
        ignoreRowClick: true,
    },
]);

const Users = ({ filterText, setFilterText }) => {
    const location = useLocation();
    const history = useHistory();
    const users = useSelector(state => state.users);
    const listings = useSelector(state => state.listings);
    const transactions = useSelector(state => state.transactions);
    const reviews = useSelector(state => state.reviews);
    const CompletedTransitions = ['transition/review-2-by-customer','transition/review-2-by-provider','transition/complete','transition/review-1-by-provider','transition/review-1-by-customer','transition/expire-customer-review-period','transition/expire-review-period'];
    
    function filterUser(user) {
        return (user.attributes.email.toLowerCase().includes(filterText.toLowerCase()) ||
                user.attributes.profile.firstName.toLowerCase().includes(filterText.toLowerCase()) ||
                user.attributes.profile.lastName.toLowerCase().includes(filterText.toLowerCase()));
    }

    function handleButtonClick(e)  {
        const user = users.filter(user => user.id.uuid === e.target.value);
        
        // This set the state for this location
        history.replace(location.pathname, { filterText: filterText });

        // This then redirects using the query to update filterText
        history.push('/listings?search=' + user[0].attributes.email);
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

    users.forEach(user => {
        user.listings = listings.filter(listing => listing.relationships.author.data.id.uuid === user.id.uuid).length;
        user.clients = transactions.filter(transaction => transaction.relationships.provider.data.id.uuid === user.id.uuid &&
                                                            CompletedTransitions.includes(transaction.attributes.lastTransition)).length;
        user.rentals = transactions.filter(transaction => transaction.relationships.customer.data.id.uuid === user.id.uuid &&
                                                            CompletedTransitions.includes(transaction.attributes.lastTransition)).length;
        user.reviews = reviews.filter(review => review.relationships.subject.data.id.uuid === user.id.uuid).length;
    })

    return (
        <div className="animated fadeIn  ">
            <DataTable
                title = 'Users'
                columns = { columns(handleButtonClick) }
                data = { users.filter(user => filterUser(user)) }
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

export default Users;