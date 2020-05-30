import React from 'react';

const Header = ({ filterText, setFilterText }) => {
    function onChange(e) {
        setFilterText(e.target.value)
    }

    return (
        <nav className="main-header navbar navbar-expand navbar-white navbar-light">
            {/* Left navbar links */}
            <ul className="navbar-nav">
                <li className="nav-item">
                    <button className="btn" data-widget="pushmenu"><i className="fas fa-bars" /></button>
                </li>
            </ul>
            {/* Search */}
            <div className="input-group input-group-sm">
                <input className="form-control form-control-navbar" type="search" placeholder="Search" aria-label="Search" onChange={onChange} value={filterText}/>
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