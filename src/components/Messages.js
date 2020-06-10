import React, { useEffect, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from "react-router-dom";
import DataTable from 'react-data-table-component';
import Mark from 'mark.js';

import Editor from './Editor.js';

const Messages = ({ filterText, setFilterText }) => {
    const location = useLocation();
    const history = useHistory();
    const users = useSelector(state => state.users);
    const transactions = useSelector(state => state.transactions);
    const messages = useSelector(state => state.messages);
    const customStyles = {
        headCells: {
            style: {
                fontWeight: 'bold',
            },
        },
    }

    const clickUser = useCallback((e) => {
        const user = users.filter(user => user.id.uuid === e.target.rel);
        
        // This set the state for this location
        history.replace(location.pathname, { filterText: filterText });

        // This then redirects using the query to update filterText
        history.push('/users?search=' + user[0].attributes.email);
    }, [ users, history, filterText, location.pathname ])
    
    const columns = useMemo(() => [
        {
            name: 'Sent',
            format: row => new Date(row.attributes.createdAt).toLocaleDateString(),
            selector: 'attributes.createdAt',
            sortable: true,
            width: '95px',
        }, 
        {
            name: 'From',
            cell: row => { return(<a type="button" href="!#" onClick={e => {e.preventDefault(); clickUser(e);}} rel={row.authorId}>{row.author}</a>) },
            selector: 'author',
            sortable: true,
            compact: true,
            maxWidth: '150px'
        },
        {
            name: 'To',
            cell: row => { return(<a type="button" href="#!" onClick={e => {e.preventDefault(); clickUser(e);}} rel={row.subjectId}>{row.subject}</a>) },
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
    ], [ clickUser ])
    
    const filterMessage = (message) => {
        const terms = filterText.toLowerCase().split(',');
        var retVal = terms.length === 0 || terms[0].length === 0 ? true : false;

        for(var i = 0; i < terms.length && terms[i].length > 0 && retVal === false; i++) {
            retVal = message.author.toLowerCase().search(terms[i]) !== -1 ||
                    message.subject.toLowerCase().search(terms[i]) !== -1 ||
                    message.authorEmail.toLowerCase().search(terms[i]) !== -1 ||
                    message.subjectEmail.toLowerCase().search(terms[i]) !== -1 ||
                    message.id.uuid.toLowerCase().search(terms[i]) !== -1 
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

    const messagesPlus = useCallback(() => {
        messages.forEach(message => {
            const a = users.filter(user => message.relationships.sender.data.id.uuid === user.id.uuid);

            if(a.length > 0) {
                message.author = a[0].attributes.profile.firstName + ' ' + a[0].attributes.profile.lastName;         
                message.authorId = a[0].id.uuid;
                message.authorEmail = a[0].attributes.email;
            }
            else {
                message.author = '<deleted>';
                message.authorId = '0';
                message.authorEmail = '';
            }
            
            // For all the transactions
            for(const tran of transactions) {
                // Search through all the messages for this one....
                for(const mess of tran.relationships.messages.data) {
                    if(message.id.uuid === mess.id.uuid) {
                        var s = [];

                        // If the message is from the provider, then the subject is the customer, and vice-versa
                        if(message.relationships.sender.data.id.uuid === tran.relationships.provider.data.id.uuid) {
                            s = users.filter(user => tran.relationships.customer.data.id.uuid === user.id.uuid);
                        }
                        else {
                            s = users.filter(user => tran.relationships.provider.data.id.uuid === user.id.uuid);
                        }

                        if(s.length > 0) {
                            message.subject = s[0].attributes.profile.firstName + ' ' + s[0].attributes.profile.lastName;
                            message.subjectEmail = s[0].attributes.email;
                            message.subjectId = s[0].id.uuid;
                        }
                        else {
                            message.subject = '<deleted>'
                            message.subjectEmail = '';
                            message.subjectId = '0';
                        }
                    }
                }
            }
        })

        return messages;
    }, [ messages, users, transactions ])

    const data = useMemo(() => messagesPlus(), [ messagesPlus ])

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
                expandableRows
                expandableRowsComponent={<Editor validSchema={'message'} />}  
                expandOnRowClicked       
            />
        </div>
    )
}

export default Messages;