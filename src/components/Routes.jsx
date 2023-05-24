import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";

import { useSelector } from "react-redux";
import Appointment from "../pages/Appointment";
import Dashboard from "../pages/Dashboard";
import MedicalRecord from "../pages/MedicalRecord";
import Profile from "../pages/Profile";
import { Logout } from './../pages/Login';
import Medicals from './../pages/Medicals';
import CreateMedial from './../pages/Medical/Create/CreateMedial';
import MedicalDeletedRecord from './../pages/MedicalDeletedRecord';
import MedicalsDeleted from './../pages/MedicalsDeleted';
import Register from "../pages/Register";
import Management from "../pages/Managenent";
import UpdatePassword from './../pages/UpdatePass';

export const PrivateRoute = ({ component: Component, ...rest }) => {
    const { isSuccess, user } = useSelector((state) => state.user);

    if (isSuccess && !user?._id) {
        console.log(user);
        // dispatch(logout())
    }
    return (
        <Route
            {...rest}
            render={(props) =>
                isSuccess ? (
                    <Component {...props} />
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                        }}
                    />
                )
            }
        />
    );
};
const Routes = () => {
    return (
        <Switch>
            <PrivateRoute exact path="/" component={Dashboard} />
            <PrivateRoute path="/appointment" component={Appointment} />
            <PrivateRoute exact path="/management" component={Management} />
            <PrivateRoute path="/profile" component={Profile} />
            <PrivateRoute path="/update-pass" component={UpdatePassword} />
            <PrivateRoute exact path="/medicals" component={Medicals} />
            <PrivateRoute exact path="/medicals-deleted" component={MedicalsDeleted} />
            <PrivateRoute path="/medicals/create" component={CreateMedial} />
            <PrivateRoute path="/medical/get-medical-record/:id" component={MedicalRecord} />
            <PrivateRoute path="/medical-deleted/get-medical-record/:id" component={MedicalDeletedRecord} />
            <PrivateRoute path="/logout" component={Logout} />
        </Switch>
    );
};

export default Routes;
