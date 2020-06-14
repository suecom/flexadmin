import React, { useEffect, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from "react-router-dom";
import DataTable from 'react-data-table-component';
import Mark from 'mark.js';

import Editor from './Editor.js';

const Reviews = ({ filterText, setFilterText }) => {
    const location = useLocation();
    const history = useHistory();
    const users = useSelector(state => state.users);
    const reviews = useSelector(state => state.reviews);
    const listings = useSelector(state => state.listings);
    const customStyles = {
        headCells: {
            style: {
                fontSize: '12px',
                paddingLeft: '6px',
                fontWeight: 'bold',
            },
        },
        expanderButton: {
            style: {     
                paddingRight: '0px',   
                paddingLeft: '0px',     
                svg: {
                    paddingLeft: '0px',
                    paddingRight: '0px',
                    margin: '0px',
                },
            },
        },
        expanderCell: {
            style: {
                flex: '0 0 24px',
                paddingRight: '0px',
                paddingLeft: '2px',
            },
        },
        cells: {
            style: {
                paddingLeft: '5px',
                fontWeight: 'lighter',
                
            },
        },
    };


    const clickListing = useCallback((e) => {
        const list = listings.filter(list => list.id.uuid === e.target.rel);
        
        // This set the state for this location
        history.replace(location.pathname, { filterText: filterText });

        // This then redirects using the query to update filterText
        history.push('/listings?search=' + list[0].attributes.title);
    }, [ listings, history, filterText, location.pathname ]);

    const clickUser = useCallback((e) => {
        const user = users.filter(user => user.id.uuid === e.target.rel);
        
        // This set the state for this location
        history.replace(location.pathname, { filterText: filterText });

        // This then redirects using the query to update filterText
        history.push('/users?search=' + user[0].attributes.email);
    }, [ users, history, filterText, location.pathname ]);

    const columns = useMemo(() => [
        {
            name: 'Sent',
            format: row => new Date(row.attributes.createdAt).toLocaleDateString(),
            selector: 'attributes.createdAt',
            sortable: true,
            width: '95px',
        }, 
        {
            name: 'By',
            cell: row => { return(<a type="button" href="!#" onClick={e => {e.preventDefault(); clickUser(e);}} rel={row.authorId}>{row.author}</a>) },
            selector: 'owner',
            sortable: true,
            compact: true,
            maxWidth: '150px'
        },
        {
            name: 'For',
            cell: row => { return(<a type="button" href="!#" onClick={e => {e.preventDefault(); clickUser(e);}} rel={row.subjectId}>{row.subject}</a>) },
            selector: 'subject',
            sortable: true,
            compact: true,
            maxWidth: '150px'
        },
        {
            name: 'Regards',
            cell: row => { return(<a type="button" href="!#" onClick={e => {e.preventDefault(); clickListing(e);}} rel={row.listingId}>{row.listing}</a>) },
            selector: 'listing',
            sortable: true,
            compact: true,
            maxWidth: '150px'
        },
        {
            name: 'Rating',
            cell: row => { 
                var k = []; 
            
                for(var i = 0; i < row.attributes.rating; i++) {
                    var j = <span key={i} className="btn-outline-success fa fa-star checked"></span>;

                    k.push(j)
                }

                return (k) 
            },
            selector: 'attributes.rating',
            sortable: true,
            compact: true,
            width: '70px',
        },
        {
            name: 'Review',
            selector: 'attributes.content',
            sortable: true,
            compact: false,
        },  
    ], [ clickUser, clickListing ]);
    
    const filterReview = (review) => {
        const terms = filterText.toLowerCase().split(',');
        var retVal = terms.length === 0 || terms[0].length === 0 ? true : false;

        for(var i = 0; i < terms.length && terms[i].length > 0 && retVal === false; i++) {
            retVal = review.author.toLowerCase().search(terms[i]) !== -1 ||
                    review.subject.toLowerCase().search(terms[i]) !== -1 ||
                    review.authorEmail.toLowerCase().search(terms[i]) !== -1 ||
                    review.subjectEmail.toLowerCase().search(terms[i]) !== -1 ||
                    review.id.uuid.toLowerCase().search(terms[i]) !== -1 ||
                    review.listing.toLowerCase().search(terms[i]) !== -1 ||
                    review.attributes.content.toLowerCase().search(terms[i]) !== -1
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
        else if(location.state !== undefined && location.state !== null && location.state.filterText !== undefined) {
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

    const reviewsPlus = useCallback(() => {
        reviews.forEach(review => {
            const a = users.filter(user => review.relationships.author.data.id.uuid === user.id.uuid);

            if(a.length > 0) {
                review.author = a[0].attributes.profile.firstName + ' ' + a[0].attributes.profile.lastName;
                review.authorEmail = a[0].attributes.email;
                review.authorId = a[0].id.uuid;
            }

            const s = users.filter(user => review.relationships.subject.data.id.uuid === user.id.uuid);

            if(s.length > 0) {
                review.subject = s[0].attributes.profile.firstName + ' ' + s[0].attributes.profile.lastName;
                review.subjectEmail = s[0].attributes.email;
                review.subjectId = s[0].id.uuid;
            }

            const l = listings.filter(list => review.relationships.listing.data.id.uuid === list.id.uuid);

            if(l.length > 0) {
                review.listing = l[0].attributes.title;
                review.listingId = l[0].id.uuid;
            }
        })

        return reviews;
    }, [ reviews, users, listings ])

    const data = useMemo(() => reviewsPlus(), [ reviewsPlus ])

    return (
        <div className="animated fadeIn">
            <DataTable
                title = 'Reviews'
                columns = { columns }
                data = { data.filter(review => filterReview(review)) }
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
                expandableRowsComponent={<Editor validSchema={'review'} />}  
                expandOnRowClicked        
            />
        </div>
    )
}

export default Reviews;