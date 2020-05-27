import React, { useState } from 'react';
import { SizeMe } from 'react-sizeme'

const BrandLink = (props) => {
    const [ bounds, setBounds ] = useState(null)
    return (
        <SizeMe
            render={({ size }) => {
                if(size.width > 100) {
                    return (
                        <a href="index3.html" className="brand-link">
                            <img src="logo.png" className="brand-image" width={size.width-20} />
                        </a>
                    )
                }
                else {
                    return (
                        <a href="index3.html" className="brand-link">
                            <img src="logo.svg" className="brand-image"  />
                        </a>
                    )
                }
            }}
        />
    )
}

export default BrandLink;