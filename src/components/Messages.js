import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from "react-router-dom";
import DataTable from 'react-data-table-component';
import Mark from 'mark.js';

const Messages = ({ filterText, setFilterText }) => {
    const location = useLocation();
    const history = useHistory();
    const users = useSelector(state => state.users);
    const transactions = useSelector(state => state.transactions);
    const messages = useSelector(state => state.messages);
    const columns = [
        {
            name: 'Sent',
            format: row => new Date(row.attributes.createdAt).toLocaleDateString(),
            selector: 'attributes.createdAt',
            sortable: true,
            width: '95px',
        }, 
        {
            name: 'From',
            cell: row => { return(<a type="button" onClick={clickAuthor} rel={row.authorId}>{row.author}</a>) },
            selector: 'author',
            sortable: true,
            compact: true,
            maxWidth: '150px'
        },
        {
            name: 'To',
            cell: row => { return(<a type="button" onClick={clickSubject} rel={row.subjectId}>{row.subject}</a>) },
            selector: 'subject',
            sortable: true,
            compact: true,
            maxWidth: '150px',
        },
        {
            name: 'Message',
            selector: 'attributes.content',
            compact: false,
        },  
    ];
    const customStyles = {
        headCells: {
            style: {
                fontWeight: 'bold',
            },
        },
    }
    
    const filterMessage = (message) => {
        const terms = filterText.toLowerCase().split(',');
        var retVal = terms.length === 0 || terms[0].length === 0 ? true : false;

        for(var i = 0; i < terms.length && terms[i].length > 0 && retVal === false; i++) {
            retVal = message.author.toLowerCase().search(terms[i]) !== -1 ||
                    message.subject.toLowerCase().search(terms[i]) !== -1 ||
                    message.id.uuid.toLowerCase().search(terms[i]) !== -1 
        }

        return retVal;
    }

    const clickAuthor = (e) => {
        const user = users.filter(user => user.id.uuid === e.target.rel);
        
        // This set the state for this location
        history.replace(location.pathname, { filterText: filterText });

        // This then redirects using the query to update filterText
        history.push('/users?search=' + user[0].attributes.email);
    }

    const clickSubject = (e) => {
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

    const messagesPlus = () => {
        messages.forEach(message => {
            const a = users.filter(user => message.relationships.sender.data.id.uuid === user.id.uuid);
            message.author = a[0].attributes.profile.firstName + ' ' + a[0].attributes.profile.lastName;
            message.authorId = a[0].id.uuid;

            // For all the transactions
            for(const tran of transactions) {
                // Search through all the messages for this one....
                for(const mess of tran.relationships.messages.data) {
                    if(message.id.uuid === mess.id.uuid) {
                        // If the message is from the provider, then the subject is the customer, and vice-versa
                        if(message.relationships.sender.data.id.uuid === tran.relationships.provider.data.id.uuid) {
                            const s = users.filter(user => tran.relationships.customer.data.id.uuid === user.id.uuid);

                            message.subject = s[0].attributes.profile.firstName + ' ' + s[0].attributes.profile.lastName;
                            message.subjectId = s[0].id.uuid;
                        }
                        else {
                            const s = users.filter(user => tran.relationships.provider.data.id.uuid === user.id.uuid);

                            message.subject = s[0].attributes.profile.firstName + ' ' + s[0].attributes.profile.lastName;
                            message.subjectId = s[0].id.uuid;
                        }
                    }
                }
            }
        })

        return messages;
    }

    const data = useMemo(() => messagesPlus(), [users, transactions, messages])

    return (
        <div className="animated fadeIn">
            <DataTable
                title = 'Messages'
                columns = { columns }
                data = { data.filter(message => filterMessage(message)) }
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

export default Messages;