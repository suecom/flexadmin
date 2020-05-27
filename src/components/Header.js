import React from 'react';

const Header = (props) => {
    function onChange(e) {
        props.cb(e.target.value.toLowerCase())
    }

    return (
        <nav className="main-header navbar navbar-expand navbar-white navbar-light">
            {/* Left navbar links */}
            <ul className="navbar-nav">
                <li className="nav-item">
                    <a className="nav-link" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars" /></a>
                </li>
            </ul>
            {/* SEARCH FORM */}
            <div className="input-group input-group-sm">
                <input className="form-control form-control-navbar" type="search" placeholder="Search" aria-label="Search" onChange={onChange} />
                <div className="input-group-append">
                    <button className="btn btn-navbar" type="submit">
                        <i className="fas fa-search" />
                    </button>
                </div>
            </div>    
        </nav>
    )
}

export default Header