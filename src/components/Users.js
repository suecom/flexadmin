import React from 'react';
import { useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';

const columns = [
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
        compact: true,
        button: true,
    },
    {
        name: 'Rented',
        selector: 'rentals',
        sortable: true,
        width: '70px',
        compact: true,
        button: true,
    },
    {
        name: 'Listings',
        selector: 'listings',
        sortable: true,
        width: '70px',
        compact: true,
        button: true,
    },
    {
        name: 'Reviews',
        selector: 'reviews',
        sortable: true,
        width: '70px',
        compact: false,
        button: true,
    },
];

const Users = ({ filterText }) => {
    const users = useSelector(state => state.users);
    const listings = useSelector(state => state.listings);
    const transactions = useSelector(state => state.transactions);
    const reviews = useSelector(state => state.reviews);
    const CompletedTransitions = ['transition/review-2-by-customer','transition/review-2-by-provider','transition/complete','transition/review-1-by-provider','transition/review-1-by-customer','transition/expire-customer-review-period','transition/expire-review-period'];
    
    function filterUser(user) {
        return (user.attributes.email.toLowerCase().includes(filterText) ||
                user.attributes.profile.firstName.toLowerCase().includes(filterText) ||
                user.attributes.profile.lastName.toLowerCase().includes(filterText));
    }
    
    users.forEach(user => {
        user.listings = listings.filter(listing => listing.relationships.author.data.id.uuid === user.id.uuid).length;
        user.clients = transactions.filter(transaction => transaction.relationships.provider.data.id.uuid === user.id.uuid &&
                                                            CompletedTransitions.includes(transaction.attributes.lastTransition)).length;
        user.rentals = transactions.filter(transaction => transaction.relationships.customer.data.id.uuid === user.id.uuid &&
                                                            CompletedTransitions.includes(transaction.attributes.lastTransition)).length;
        user.reviews = reviews.filter(review => review.relationships.subject.data.id.uuid === user.id.uuid).length;
    })

    return (
        <div className="animated fadeIn">
            <DataTable
                title = 'Users'
                columns = { columns }
                data = { users.filter(user => filterUser(user)) }
                keyField = 'id.uuid'
                dense
                fixedHeader
                striped
                noHeader           
            />
        </div>
    )
}

export default Users;