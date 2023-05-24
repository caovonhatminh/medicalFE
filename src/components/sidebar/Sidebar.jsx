import React from "react";

import "./sidebar.css";

import logo from "../../assets/images/logo.png";

import sidebar_items from "../../assets/JsonData/sidebar_routes.json";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const SidebarItem = (props) => {
    const active = props.active ? "active" : "";

    return (
        <div className="sidebar__item">
            <div className={`sidebar__item-inner ${active}`}>
                <i className={props.icon}></i>
                <span>{props.title}</span>
            </div>
        </div>
    );
};

const Sidebar = (props) => {
    const { user } = useSelector(state => state.user)

    const activeItem = sidebar_items.findIndex(
        (item) => item.route === props.location.pathname
    );

    return (
        <div className="sidebar">
            <div className="sidebar__logo">
                <img src={logo} alt="company logo" />
            </div>
            {
                user?.role === 'admin' ?
                    <Link to={"management"} >
                        <SidebarItem
                            title={'Quản lý'}
                            icon={"bx bx-user"}
                            active={true}
                        />
                    </Link> :
                    sidebar_items.map((item, index) => (
                        <Link to={item.route} key={index}>
                            <SidebarItem
                                title={item.display_name}
                                icon={item.icon}
                                active={index === activeItem}
                            />
                        </Link>
                    ))}
            <Link to="/logout">
                <SidebarItem
                    title={"Đăng xuất"}
                    icon={"bx bx-log-out-circle bx-rotate-180"}
                    active={false}
                />
            </Link>
        </div>
    );
};

export default Sidebar;
