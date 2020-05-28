import React from 'react';

const Footer = (props) =>  {
    return (
        <footer className="main-footer">
            <strong>Copyright © 2020 <a href="https://oldencars.com">OldenCars Ltd</a>. </strong>
            All rights reserved.
            <div className="float-right d-none d-sm-inline-block">
                <b>Version</b> 0.2.0
            </div>
        </footer>
    )
}

export default Footer;
