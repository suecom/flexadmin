import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from "react-router-dom";

import BrandLink from './BrandLink';

const SideBar = ({ routes }) =>  {
    const transactions = useSelector(state => state.transactions);
    const users = useSelector(state => state.users);
    const listings = useSelector(state => state.listings); 
    const reviews = useSelector(state => state.reviews);
    const messages = useSelector(state => state.messages);
    const images = useSelector(state => state.images);

    const makeLabel = useCallback((route) => {
        var cnt = 0;

        switch(route.label.toLowerCase()) {
            case 'users':
                cnt = users.length;
                break;
            case 'listings':
                cnt = listings.length;
                break;
            case 'transactions':
                cnt = transactions.length;
                break;
            case 'reviews':
                cnt = reviews.length;
                break;
            case 'messages':
                cnt = messages.length;
                break;
            case 'images':
                cnt = images.length;
                break;
            default:
                break;
        }

        return <p>{route.label}({cnt})</p> 
    }, [ users, listings, transactions, reviews, messages, images ])

    return (
        <aside className="main-sidebar  sidebar-dark-green elevation-4">
            <BrandLink logo="logo.png" />
            {/* Sidebar */}
            <div className="sidebar">
                <nav className="mt-2">
                    <ul className="nav nav-pills nav-sidebar flex-column" role="menu" data-accordion="false">
                        {routes.map((route, index) => (
                            <li className="nav-item" key={index}>
                                <NavLink to={route.path} className="nav-link">
                                    <i className={route.icon}></i>
                                    { makeLabel(route) }
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            {/* /.sidebar */}
        </aside>
    )
}

export default SideBar;