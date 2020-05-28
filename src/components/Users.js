import React from 'react';
import DataTable from 'react-data-table-component';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actions from '../actions/userActions'

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
    function filterUser(user) {
        return (user.attributes.email.toLowerCase().includes(props.filterText) ||
                user.attributes.profile.firstName.toLowerCase().includes(props.filterText) ||
                user.attributes.profile.lastName.toLowerCase().includes(props.filterText));
    }

    /*
    useEffect(() => {
        if(props.users.length < 1) {
            props.actions.loadUsers()
        }
    } )
    */
    
    return (
        <div className="animated fadeIn">
            <DataTable
                title = 'Users'
                columns = { columns }
                data = { props.users.filter(user => filterUser(user)) }
                keyField = 'id.uuid'
                dense
                fixedHeader
                striped
                noHeader           
            />
        </div>
    )
}

function mapStateToProps(state, ownProps) {
    if (state.users.length > 0) {
        return {
            users: state.users
        };
    } else {
        return {
            users: []
        }
    }
}
  
function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(actions, dispatch) }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(Users);
