import React, { useEffect, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from "react-router-dom";
import DataTable from 'react-data-table-component';
import Mark from 'mark.js';

const Reviews = ({ filterText, setFilterText }) => {
    const location = useLocation();
    const history = useHistory();
    const users = useSelector(state => state.users);
    const reviews = useSelector(state => state.reviews);
    const customStyles = {
        headCells: {
            style: {
                fontWeight: 'bold',
            },
        }
    };

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
            name: 'Rating',
            cell: row => { return ( row.stars ) },
            selector: 'attributes.rating',
            sortable: true,
            compact: true,
            //right: true,
            width: '70px',
        },
        {
            name: 'Review',
            selector: 'attributes.content',
            sortable: true,
            compact: false,
        },  
    ], [ clickUser ]);
    
    const filterReview = (review) => {
        const terms = filterText.toLowerCase().split(',');
        var retVal = terms.length === 0 || terms[0].length === 0 ? true : false;

        for(var i = 0; i < terms.length && terms[i].length > 0 && retVal === false; i++) {
            retVal = review.author.toLowerCase().search(terms[i]) !== -1 ||
                    review.subject.toLowerCase().search(terms[i]) !== -1 ||
                    review.authorEmail.toLowerCase().search(terms[i]) !== -1 ||
                    review.subjectEmail.toLowerCase().search(terms[i]) !== -1 ||
                    review.id.uuid.toLowerCase().search(terms[i]) !== -1 
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

            var k = []; 
            for(var i = 0; i < review.attributes.rating; i++) {
                var j = <span key={i} className="btn-outline-success fa fa-star checked"></span>;

                k.push(j)
            }
            review.stars = k;
        })

        return reviews;
    }, [ reviews, users ])

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
            />
        </div>
    )
}

export default Reviews;