import React from 'react';
import { NavLink } from "react-router-dom";

import BrandLink from './BrandLink';
import routes from '../routes';

const SideBar = (props) =>  {
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
                                    <p>{route.label}</p>
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