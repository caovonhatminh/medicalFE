import React, { useEffect } from "react";

import "./layout.css";

import Sidebar from "../sidebar/Sidebar";
import TopNav from "../topnav/TopNav";
import Routes from "../Routes";

import {BrowserRouter, Route, useHistory, useLocation} from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";

import Login from "./../../pages/Login";
import Register from "./../../pages/Register";
import { setColorTheme, setModeTheme } from "../../redux/slices/ThemeSlice";
import { GetUserInfo } from "../../redux/slices/UserSlice";

const Layout = () => {
    const { isSuccess, user } = useSelector((state) => state.user);

    const themeReducer = useSelector((state) => state.theme);
    const dispatch = useDispatch();

    useEffect(() => {
        const themeClass = localStorage.getItem(
            "themeMode",
            "theme-mode-light"
        );

        const colorClass = localStorage.getItem(
            "colorMode",
            "theme-mode-light"
        );

        dispatch(setModeTheme(themeClass));
        dispatch(setColorTheme(colorClass));
        if (localStorage.getItem("access_token")) dispatch(GetUserInfo());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <BrowserRouter>
            <Route path="/login" component={Login} />
            {isSuccess ? (
                <Route
                    render={(props) => (
                        <div
                            className={`layout ${themeReducer.mode} ${themeReducer.color}`}
                        >
                                <Sidebar {...props} />
                                <div className="layout__content">
                                    <TopNav />
                                    <div className="layout__content-main">
                                        <Routes />
                                    </div>
                                </div>
                        </div>
                    )}
                />
            ) : (
                <Routes />
            )}
        </BrowserRouter>
    );
};

export default Layout;
