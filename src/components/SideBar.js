import React from 'react';
import {  Link } from "react-router-dom";

import BrandLink from './BrandLink';
import routes from '../routes';

const SideBar = (props) =>  {
    return (
        <aside className="main-sidebar sidebar-dark-primary elevation-4">
            <BrandLink logo="logo.png" />
            {/* Sidebar */}
            <div className="sidebar">
                <nav className="mt-2">
                    <ul className="nav nav-pills nav-sidebar flex-column" role="menu" data-accordion="false">
                        {routes.map((route, index) => (
                            <li className="nav-item" key={index}>
                                <Link to={route.path} className="nav-link">
                                    <i className={route.icon}></i>
                                    <p>{route.label}</p>
                                </Link>
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