import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from "react-router-dom";
import DataTable from 'react-data-table-component';
import Mark from 'mark.js';

const Images = ({ filterText, setFilterText }) => {
    const location = useLocation();
    const history = useHistory();
    const images = useSelector(state => state.images);
    const users = useSelector(state => state.users);
    const listings = useSelector(state => state.listings);
    const columns = [
        {
            name: 'Type',
            selector: 'origin',
            sortable: true,
            width: '95px',
        },
        {
            name: 'Name',
            cell: row => { return(<a type="button" onClick={row.orgin==='User' ? clickUser : clickListing } rel={row.nameId}>{row.name}</a>) },
            selector: 'name',
            sortable: true,
            compact: true,
        },   
        {
            name: 'Image',
            cell: row => { return (<img className="img-size-50 mr-3 img-circle" src={ row.attributes.variants['square-small'].url } />) },
        },  
    ];
    const customStyles = {
        rows: {
          style: {
            minHeight: '70px', // override the row height
          }
        },
    }
    
    const filterImage = (image) => {
        const terms = filterText.toLowerCase().split(',');
        var retVal = terms.length === 0 || terms[0].length === 0 ? true : false;

        for(var i = 0; i < terms.length && terms[i].length > 0 && retVal === false; i++) {
            retVal = image.name.toLowerCase().search(terms[i]) !== -1 ||
                image.userEmail.toLowerCase().search(terms[i]) !== -1 ||
                image.id.uuid.toLowerCase().search(terms[i]) !== -1
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

    const clickListing = (e) =>  {
        const listing = listings.filter(listing => listing.id.uuid === e.target.rel);
        
        // This set the state for this location
        history.replace(location.pathname, { filterText: filterText });

        // This then redirects using the query to update filterText
        history.push('/listings?search=' + listing[0].id.uuid.substr(listing[0].id.uuid.lastIndexOf('-')+1,));
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

    const imagesPlus = () => {
        images.forEach(image => {
            const user = users.filter(user => user.relationships.profileImage.data != null ? user.relationships.profileImage.data.id.uuid === image.id.uuid : false);

            if(user.length > 0) {
                image.name = user[0].attributes.profile.firstName + ' ' + user[0].attributes.profile.lastName;
                image.nameId = user[0].id.uuid;
                image.userEmail = user[0].attributes.email;
                image.origin = 'User';
            }
            else {
                listings.forEach(listing => {
                    const list = listing.relationships.images.data.filter(i => i.id.uuid === image.id.uuid);

                    if(list.length > 0) {
                        image.name = listing.attributes.title;
                        image.nameId = listing.id.uuid;
                    }
                })
                image.userEmail = '';
                image.origin = 'Listing';
            }
        })

        return images;
    }

    const data = useMemo(() => imagesPlus(), [images, users, listings])

    return (
        <div className="animated fadeIn">
            <DataTable
                title = 'Images'
                columns = { columns }
                data = { data.filter(image => filterImage(image)) }
                keyField = 'id.uuid'
                highlightOnHover
                customStyles={ customStyles }
                pointerOnHover
                fixedHeader
                fixedHeaderScrollHeight = "85vh"
                noHeader  
                defaultSortField = 'attributes.createdAt' 
                defaultSortAsc = { false }            
            />
        </div>
    )
}

export default Images;