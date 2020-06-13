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

const AuthRoute = (props) => (
    <Route {...props}
        render = { (routerProps) => (
            props.isAuth === true 
                ? ( renderMergedProps(props.comp, routerProps, props) ) 
                : ( renderMergedProps(Login, routerProps, { requestedPath: props.path, submit: props.submit, message: props.message }) ) 
        )}
    />
)

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

    if(!isAuth) {
        marketplaceSdk.currentUser.show().then(res => {
            if(res != null &&
                    res.data.data.attributes.profile.protectedData.admin !== undefined &&
                    res.data.data.attributes.profile.protectedData.admin === true) {
                setAuth(true);
            }
        });
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
                        comp = { route.component }  
                        submit = { handleSubmit }
                        message = { message }
                    />
                ))}
                <Route { ...props }
                    path='/login'
                    exact={ true } 
                    render = { (routerProps) => 
                        renderMergedProps(Login, routerProps, { submit: handleSubmit, message: message }) 
                    }
                />
                <Route path='*' component={() => <Redirect to="/Users" />}/>
            </Switch>
        </div>
    )
}

export default Content;