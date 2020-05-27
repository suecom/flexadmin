import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import * as flexIntegrationSdk from 'sharetribe-flex-integration-sdk';

import axios from 'axios';

const integrationSdk = flexIntegrationSdk.createInstance({
    clientId: '58a55f71-7650-423f-bbd3-b4f5e61927b7', //process.env.FLEX_INTEGRATION_CLIENT_ID,
    clientSecret: '14cd97d21409e22c720e58fbf872a2113fb7d1e2', //process.env.FLEX_INTEGRATION_CLIENT_SECRET,
    baseUrl: process.env.FLEX_INTEGRATION_BASE_URL || 'https://flex-api.sharetribe.com',
});


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
        selector: 'rented',
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
  
const Users = (props) => {
    const [ data, setData ] = useState([]);

    function filterUser(user) {
        return (user.attributes.email.toLowerCase().includes(props.filterText) ||
                user.attributes.profile.firstName.toLowerCase().includes(props.filterText) ||
                user.attributes.profile.lastName.toLowerCase().includes(props.filterText));
    }

    function loadFromServer(url) {
        integrationSdk.users.query({ 
                    'include': 'profileImage,stripeAccount',
                    expand: true
                }).then(res => {
            setData(res.data.data)
        })
        /*
        axios.get(url + 'users')s
            .then(res => {
                setData(res.data);
            })
        */
    }

    useEffect(() => {
        loadFromServer(props.url);
    }, [props.url], )

    return (
        <div className="animated fadeIn">
            <DataTable
                title = 'Users'
                columns = { columns }
                data = { data.filter(item => filterUser(item)) }
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