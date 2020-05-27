import React from 'react';
import { Switch, Route } from 'react-router-dom';

import routes from '../routes';

const renderMergedProps = (component, ...rest) => {
    const finalProps = Object.assign({}, ...rest);

    return (
      React.createElement(component, finalProps)
    );
}

const Content = (props) => {
    return (
        <div className="content-wrapper">
            <Switch>
                {routes.map((route, index) => (
                    <Route {...props}
                        key={index}
                        path={route.path}
                        exact={route.exact}
                        render={routeProps => {
                            return renderMergedProps(route.component, routeProps, props);
                        }}
                    />
                ))}
            </Switch>
        </div>
    )
}

export default Content;