import React, { useState, useCallback } from 'react';

const Login = ({ authSubmit, authMessage, location, history }) =>  {
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');

    const handleSubmit = useCallback((e) => {
        e.preventDefault();

        if(email === '' || password === '') return;

        authSubmit(email, password, location, history )
    }, [ authSubmit, location, history, email, password ]);

    return (
        <div className="login-box">
            <div className="card">
                <div className="card-body login-card-body">
                    <p className={authMessage.style}>{ authMessage.text }</p>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group mb-3">
                            <input type="email" className="form-control" placeholder="Email" autoComplete="username" onChange={e => setEmail(e.target.value)} />
                            <div className="input-group-append">
                                <div className="input-group-text">
                                    <span className="fas fa-envelope" />
                                </div>
                            </div>
                        </div>
                        <div className="input-group mb-3">
                            <input type="password" className="form-control" placeholder="Password" autoComplete="current-password" onChange={e => setPassword(e.target.value)}/>
                            <div className="input-group-append">
                                <div className="input-group-text">
                                    <span className="fas fa-lock" />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-8">
                                <div className="icheck-primary">
                                    <input type="checkbox" id="remember" />
                                    <label htmlFor="remember"><span style={{whiteSpace: 'pre-wrap'}}>  </span>Remember Me</label>
                                </div>
                            </div>
                            <div className="col-4">
                                <button type="submit" className="btn btn-primary btn-block btn-success" >Sign In</button>
                            </div>
                        </div>
                    </form>
                    <div className="social-auth-links text-center mb-3">
                        <br/>
                        <p>- YOU MUST -</p>         
                        <a href="/login" className="btn btn-block ">
                            <img src="sharetribe.png" alt='Sharetribe'/> Sign in using Sharetribe/FFS
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;