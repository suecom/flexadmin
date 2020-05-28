import React  from 'react';
import { SizeMe } from 'react-sizeme'

const BrandLink = (props) => {
    return (
        <SizeMe
            render={({ size }) => {
                if(size.width > 100) {
                    return (
                        <div className="brand-link">
                            <img src="logo.png" alt="logo" className="brand-image" width={size.width-20} />
                        </div>
                    )
                }
                else {
                    return (
                        <div className="brand-link">
                            <img src="logo.svg" alt="logo" className="brand-image"  />
                        </div>
                    )
                }
            }}
        />
    )
}

export default BrandLink;