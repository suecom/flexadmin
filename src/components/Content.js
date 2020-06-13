import React, { useState } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import routes from '../routes';
import Login from './Login';


const renderMergedProps = (component, ...rest) => {
    const finalProps = Object.assign({}, ...rest);

    return (
        React.createElement(component, finalProps)
    );
}

const AuthRoute = (props) => (
    <Route {...props}
        render = { (routerProps) => (
            props.isAuth === true 
                ? ( renderMergedProps(props.comp, routerProps, props) ) 
                : ( renderMergedProps(Login, routerProps, props) ) 
        )}
    />
)

const Content = (props) => {
    return (
        <div className="content-wrapper">            
            <Switch>          
                {routes.map((route, index) => (
                    <AuthRoute { ...props } 
                        key = { index }
                        path = { route.path }
                        exact = { route.exact }   
                        comp = { route.component }  
                    />
                ))}
                <Route { ...props }
                    path='/login'
                    exact={ true } 
                    render = { (routerProps) => 
                        renderMergedProps(Login, routerProps, props) 
                    }
                />
                <Route path='*' component={() => <Redirect to="/Users" />}/>
            </Switch>
        </div>
    )
}

export default Content;