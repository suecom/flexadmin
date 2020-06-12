import React, { useState } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import routes from '../routes';
import Login from './Login';
import { marketplaceSdk } from '../flexsdk.js'

const renderMergedProps = (component, ...rest) => {
    const finalProps = Object.assign({}, ...rest);

    return (
        React.createElement(component, finalProps)
    );
}

const AuthRoute = (props) => {
    return (
        <Route { ...props }
            render = { (routeProps) =>
                props.isAuth ? ( renderMergedProps(props.Component, routeProps, props) ) :
                ( <Redirect to={{ pathname: '/login', requestedPath: props.path}} /> )
            }
        />
    )
}

const Content = (props) => {
    const [ isAuth, setAuth ] = useState(false);
    const [ message, setMessage ] = useState({ style: 'login-box-msg', text: 'Sign in to start'});

    const handleSubmit = (email, password, location, history ) => {
        marketplaceSdk.login({ username: email, password: password }).then(loginRes => {
            if(loginRes.status === 200) {
                marketplaceSdk.currentUser.show().then(res => {
                    if(res.data.data.attributes.profile.protectedData.admin !== undefined &&
                            res.data.data.attributes.profile.protectedData.admin === true) {
                        setAuth(true);
                        if(location.requestedPath !== undefined) {
                            history.push(location.requestedPath)
                        }
                        else {
                            history.push('/users')
                        }
                    }
                    setMessage({ style: 'login-box-error-msg', text: 'Not authorized'})
                })
                .catch(e => {
                    setMessage({ style: 'login-box-error-msg', text: 'Try again...'})
                });
            } 
            console.log(loginRes);
        })
        .catch((e) => {
            setMessage({ style: 'login-box-error-msg', text: 'Try again...'})
        })
    }

    return (
        <div className="content-wrapper">            
            <Switch>
                {routes.map((route, index) => (
                    <AuthRoute { ...props } 
                        key = { index }
                        path = { route.path }
                        exact = { route.exact } 
                        isAuth = { isAuth }    
                        Component = { route.component }  
                    />
                ))}
                <Route { ...props }
                    path='/'
                    exact={ false } 
                    render = { 
                        (routeProps) => { return renderMergedProps(Login, routeProps, { submit: handleSubmit, message: message })} 
                    } 
                />
            </Switch>
        </div>
    )
}

export default Content;