import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Table from "../components/table/Table";
import { Avatar, Button, Empty, Space, Tooltip } from "antd";
import styled from "styled-components";
import { CalendarOutlined, ContactsOutlined, EditOutlined, EyeOutlined, HomeOutlined, PhoneOutlined } from "@ant-design/icons";
import moment from "moment";
import { axiosAuth } from "../config/axios";
import { URL_AVATAR } from "../constants";
import Chart from 'react-apexcharts'
import { GetMedicals } from "../redux/slices/MedicalSlice";
import Viewer from "react-viewer";
import StatusCard from "../components/status-card/StatusCard";

const renderCusomerHead = (item, index) => <th key={index}>{item}</th>;

const renderCusomerBody = (item, index, history) => {
    return (
        <tr key={index}>
            <td>{moment(item.date).format("DD/MM/YYYY")}</td>
            <td>{item.medicalName}</td>
            <td>{item.fullName}</td>
            <td>
                <Tooltip title="Xem chi tiết">
                    <EyeOutlined
                        onClick={() =>
                            history.push(
                                `/medical/get-medical-record/${item._id}`
                            )
                        }
                    />
                </Tooltip>
            </td>
        </tr>
    );
};

const Dashboard = () => {
    const [medicalRecent, setMedicalRecent] = useState([]);
    const { user } = useSelector((state) => state.user);
    const themeReducer = useSelector((state) => state.theme);
    const { medicalStatistics, medicalTotal } = useSelector((state) => state.medical);
    const history = useHistory();
    const dispatch = useDispatch()
    const [viewImage, setViewImage] = useState([]);
    const [isShowImage, setIsShowImage] = useState(false);

    const { isSuccess : isSSMedical } = useSelector(state => state.medical)
    const { isSuccess : isSSUser} = useSelector(state => state.user);

    useEffect(() => {
        if(isSSUser && user?.username && (!user.phone || !user.fullName)) {
            history && history.push("/profile")
            return;
        }
    }, [isSSUser, isSSMedical, history]);

    const chartOptions = {
        series: [{
            name: 'Số lần khám',
            data: medicalStatistics
        }],
        options: {
            color: ['#6ab04c', '#2980b9'],
            chart: {
                background: 'transparent'
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth'
            },
            xaxis: {
                categories: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12']
            },
            legend: {
                position: 'top'
            },
            grid: {
                show: false
            }
        },
    }

    const showImage = () => {
        setViewImage([{ src: `${URL_AVATAR}/${user?.avatar}` }])
        setIsShowImage(true)
    }

    useEffect(() => {
        if (user.role === 'admin') {
            history.push("/management");
        }
    }, [user]);

    useEffect(() => {
        dispatch(GetMedicals(user))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    useEffect(() => {
        if(user?.username) {
            axiosAuth({
                url: "/medical/recent",
                method: "get",
            })
                .then(async (result) => {
                    const responseUsers = await axiosAuth({
                        url: "/user/get-users",
                        method: "get",
                    })

                    const listBsi = responseUsers.data.data.filter(({role})=> role === 'bs').map((item) => ({label: item?.fullName, value: item.username}))

                    let listFilter = result.data.data
                    if(user?.role == "bs") {
                        listFilter = listFilter?.filter((item) => item?.users?.includes(user?.username));
                    }

                    listFilter = listFilter.map(item => {
                        const listUser = item?.users?.split(',');

                        const list = listUser?.map(user => {
                            const result = listBsi?.find(bsi => bsi.value === user)
                            return result ? result?.label : ''
                        })
                        return ({
                            ...item,
                            listUser: list,
                        })
                    })
                    setMedicalRecent(listFilter.slice(0, 10));

                })
                .catch((e) => {
                    console.log(e);
                });
        }

    }, [user?.username, user?.role]);

    return (
        <div>
            <Viewer
                images={viewImage}
                visible={isShowImage}
                onClose={() => setIsShowImage(false)}
                onMaskClick={() => setIsShowImage(false)}
            />
            <h2 className="page-header layout">Tổng quan</h2>
            <div className="row">
                <div className="col-6">
                    <div className="card">
                        <div className="row">
                            <div className="col-4">
                                <WrapperAvatar>
                                    <AvatarProfile
                                        src={`${URL_AVATAR}/${user?.avatar}`}
                                        onClick={showImage}
                                    >
                                        {user?.fullName?.slice(0, 2).toUpperCase() ||
                                            user?.username?.slice(0, 2).toUpperCase()}
                                    </AvatarProfile>
                                    <CButton
                                        shape="circle"
                                        className="btn-edit-profile"
                                        onClick={() => history.push("/profile")}
                                    >
                                        <EditOutlined />
                                    </CButton>
                                </WrapperAvatar>
                            </div>
                            <div className="col-8">
                                <Title>{user?.fullName || user?.username}</Title>
                                <Space direction="vertical">
                                    <div className="col-12">
                                        <ContactsOutlined />
                                        <TitleMin>Tuổi:</TitleMin>
                                        <TextNoWrap>
                                            {user?.birthday
                                                ? Math.floor(
                                                    moment().diff(
                                                        user?.birthday,
                                                        "years",
                                                        true
                                                    )
                                                )
                                                : " Chưa cập nhật"}
                                        </TextNoWrap>
                                    </div>
                                    <div className="col-12">
                                        <CalendarOutlined />
                                        <TitleMin>Ngày sinh:</TitleMin>
                                        <TextNoWrap>
                                            {user?.birthday
                                                ? moment(user?.birthday).format(
                                                    "DD/MM/YYYY"
                                                )
                                                : " Chưa cập nhật"}
                                        </TextNoWrap>
                                    </div>
                                    <div className="col-12">
                                        <PhoneOutlined />
                                        <TitleMin>Điện thoại:</TitleMin>
                                        <TextNoWrap>
                                            {user?.phone ? user?.phone : "Chưa cập nhật"}
                                        </TextNoWrap>
                                    </div>
                                    <div className="col-12">
                                        <HomeOutlined />
                                        <TitleMin> Địa chỉ:</TitleMin>
                                        <TextNoWrap>
                                            {user?.address ? user?.address : " Chưa cập nhật"}
                                        </TextNoWrap>
                                    </div>
                                </Space>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-6">
                    <div className="card full-height">
                        <TextPos className="layout">Biểu đồ năm {moment().format("YYYY")}</TextPos>
                        <Chart
                            options={themeReducer === 'theme-mode-dark' ? {
                                ...chartOptions.options,
                                theme: { mode: 'dark' }
                            } : {
                                ...chartOptions.options,
                                theme: { mode: 'light' }
                            }}
                            series={chartOptions.series}
                            type='line'
                            height='95%'
                        />
                    </div>
                </div>
            </div>
            <div className="row">
                {/*{*/}
                {/*    medicalTotal?.map((item, index) => (*/}
                {/*        <div className="col-3" key={index}>*/}
                {/*            <StatusCard*/}
                {/*                icon={item.icon}*/}
                {/*                count={item.count}*/}
                {/*                title={item.title}*/}
                {/*            />*/}
                {/*        </div>*/}
                {/*    ))*/}
                {/*}*/}
            </div>
            <div className="card">
                <div className="card__header">
                    <h3 className="layout">Bệnh nhân khám gần đây</h3>
                </div>
                {
                    medicalRecent.length ? <><div className="card__body">
                        <Table
                            headData={["Ngày khám", "Bệnh", "Bệnh nhân", ""]}
                            renderHead={(item, index) =>
                                renderCusomerHead(item, index)
                            }
                            bodyData={medicalRecent}
                            renderBody={(item, index) =>
                                renderCusomerBody(item, index, history)
                            }
                        />

                    </div>
                        <div className="card__footer">
                            <Link to="/medicals">Xem thêm</Link>
                        </div></> : <Empty />
                }
            </div>
        </div>
    );
};

const CButton = styled(Button)`
    color: var(--txt-white);
    background-color: var(--main-color);
    box-shadow: var(--box-shadow);

    :hover {
     background-color: var(--second-color);
     color: var(--txt-white);
    }
`

const AvatarProfile = styled(Avatar)`
    width: 150px;
    height: 150px;
    box-shadow: 0px 1px 7px 0  var(--main-color);
    font-size: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const WrapperAvatar = styled.div`
    position: relative;

    .btn-edit-profile {
        position: absolute;
        left: 120px;
        bottom: 20px;
    }
`;

const Title = styled.div`
    font-size: 22px;
    font-weight: bold;
    letter-spacing: 2px;
    transform: translateY(-15px);
`;

const TextPos = styled.span`
    position: absolute;
    top: 15px;
    left: 20px;
`

const TitleMin = styled.div`    
    margin-left: 10px;
    display: inline-block;
    min-width: 100px;
`

const TextNoWrap = styled.div`
    display: inline-block;
    white-space: nowrap;
`

export default Dashboard;
