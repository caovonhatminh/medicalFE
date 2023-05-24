import React, {useEffect, useState} from "react";
import "./topnav.css";
import {Link, useHistory, useLocation} from "react-router-dom";
import Dropdown from "../dropdown/Dropdown";
import ThemeMenu from "../thememenu/ThemeMenu";
import user_menu from "../../assets/JsonData/user_menus.json";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { Avatar, Tooltip, Typography } from "antd";
import { URL_AVATAR } from "../../constants";
import { GetAppointment } from './../../redux/slices/AppointmentSlice';
import moment from "moment";

const { Text } = Typography

const renderNotificationItem = (item, index, history) => (
    <div className="notification-item" key={index} onClick={() => history.push(
        `/medical/get-medical-record/${item.medicalrecordid}`
    )}>
        <i style={{ fontSize: '13px' }}>{moment(item.updateAt).format("DD/MM/YYYY")}</i>
        <Tooltip title={item.medicalName}>
            <Text className="layout" ellipsis>{item.medicalName}</Text>
        </Tooltip>
    </div>
);

const renderUserToggle = (user) => (
    <div className="topnav__right-user">
        <div className="topnav__right-user__image">
            {/* <img src={user.avatar} alt="" /> */}
            <AvatarProfile src={`${URL_AVATAR}/${user?.avatar}`}>
                {user?.fullName?.slice(0, 2).toUpperCase() ||
                    user?.username?.slice(0, 2).toUpperCase()}
            </AvatarProfile>
        </div>
        <div className="topnav__right-user__name">{user?.fullName}</div>
    </div>
);

const renderUserMenu = (item, index) => (
    <Link to={item.link} key={index}>
        <div className="notification-item">
            <i className={item.icon}></i>
            <span>{item.content}</span>
        </div>
    </Link>
);

const Topnav = () => {
    const {isSuccess,user} = useSelector((state) => state.user);
    const appointment = useSelector((state) => state.appointment.appointment);
    const dispatch = useDispatch()
    const history = useHistory()
    const [notify, setNotify] = useState(true);

    React.useEffect(() => {
        if(user?.username) {
            dispatch(GetAppointment(user))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.username])

    const handleSearch = (e) => {
        const { value } = e.target
        if (e.keyCode === 13) {
            history.push(`/medicals?q=${value}`)
        }
    }
    const location = useLocation();
    //
    // useEffect(() => {
    //     if(isSuccess && (!user.phone || !user.fullName)) {
    //         history && history.push("/profile")
    //         return;
    //     }
    // }, []);


    return (
        <div className="topnav">
            <div className="topnav__search">
                {/* <input type="text" id="search-top" placeholder="Search here..." onKeyDown={handleSearch} /> */}
                <i className="bx bx-search"></i>
            </div>
            <div className="topnav__right">
                <div className="topnav__right-item">
                    {/* dropdown here */}
                    <Dropdown
                        customToggle={() => renderUserToggle(user)}
                        contentData={user_menu}
                        renderItems={(item, index) =>
                            renderUserMenu(item, index)
                        }
                    />
                </div>
                <div className="topnav__right-item" onClick={() => setNotify(false)}>
                    <Dropdown
                        icon="bx bx-bell"
                        badge={notify && appointment?.length}
                        contentData={appointment.slice(0, 5)}
                        renderItems={(item, index) =>
                            renderNotificationItem(item, index, history)
                        }
                        renderFooter={() => appointment.length ? <Link style={{ width: '100%', display: 'block' }} to="/appointment">Xem thêm</Link> : <></>}
                    />
                    {/* dropdown here */}
                </div>
                <div className="topnav__right-item">
                    <ThemeMenu />
                </div>
            </div>
        </div>
    );
};

export default Topnav;

const AvatarProfile = styled(Avatar)`
    width: 40px;
    height: 40px;
    /* background-color: var(--main-color); */
    font-size: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
`;
