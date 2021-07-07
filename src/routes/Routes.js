import React from 'react';
import { Route, Switch } from 'react-router';
import { ForgotPassword, Home, Login, Register, RegisterComplete } from '../views';

const CommonRoutes = () => {
    return (<Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/register/complete" component={RegisterComplete} />
        <Route exact path="/forgot/password" component={ForgotPassword} />
    </Switch>);
};

export default CommonRoutes;