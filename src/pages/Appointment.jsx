import React, {useEffect, useState} from "react";
import Table from "../components/table/Table";
import moment from "moment";
import {Empty, Row, Space, Spin, Tooltip, Typography} from "antd";
import { useDispatch, useSelector } from 'react-redux';
import {CopyOutlined, EyeOutlined, PhoneOutlined} from '@ant-design/icons';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import UpdateAppointment from "./Medical/Update/UpdateAppointment";
import { ZaloIcon } from "../assets/Icon/ZaloIcon";
import { EditOutlined } from '@ant-design/icons';
import { GetAppointment } from "../redux/slices/AppointmentSlice";

const appointmentTableHead = ["#", "Ngày hẹn", "Bệnh nhân", "Bệnh", "Bác sĩ","SĐT", "Địa chỉ", "", ""];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const { Text,Paragraph  } = Typography
const renderBody = (item, index, history, openModal) => (
    <tr key={index}>
        <th>{item.stt}</th>
        <td>{moment(item.appointment).format("HH:mm DD/MM/YYYY")}</td>
        <td width={200}>{item?.fullName}</td>
        <td width={300}>{item?.medicalName}</td>
        <td width={300}>{item?.listUser?.join(", ")}</td>
        <td width={150}><Paragraph copyable={{
            icon: <CopyOutlined className="txtcolor" />
        }} className="txtcolor">{item?.phone}</Paragraph>
            <Space>
                <Tooltip title="Gọi ngay">
                    <PhoneOutlined onClick={() => window.open(`tel:${item?.phone}`)} style={{fontSize: 24}} />
                </Tooltip>
                <Tooltip title="Nhắn zalo">
                    <ZaloIcon onClick={() => window.open(`https://zalo.me/${item?.phone}`)} />
                </Tooltip>
            </Space></td>
        <td width={150}>
            <Text style={{ width: 150 }} ellipsis={{ tooltip: item?.address }} className="txtcolor">
                {item?.address}
            </Text>
        </td>
        {/* <td>
            {
                item.phone ?
                    <Row align="middle" style={{ gap: '10px' }}>
                        <PhoneOutlined style={{ fontSize: '22px' }} onClick={() => window.open(`tel:${item.phone}`)} />
                        <ZaloIcon onClick={() => window.open(`https://zalo.me/${item.phone}`)} />
                    </Row> : <></>
            }

        </td> */}
        <td>
            <Tooltip title="Xem chi tiết">
                <EyeOutlined
                    onClick={() =>
                        history.push(
                            `/medical/get-medical-record/${item.medicalrecordid}`
                        )
                    }
                />
            </Tooltip>
        </td>
        <td>
            <Tooltip title="Chỉnh sửa lịch hẹn">
                <EditOutlined onClick={() => openModal(item)} />
            </Tooltip>
        </td>
    </tr>
);

const Appointment = () => {
    const { appointment } = useSelector(state => state.appointment)
    const history = useHistory()
    const [modalVisible, setModalVisible] = useState(false);
    const dispatch = useDispatch()
    const [recordUpdate, setRecordUpdate] = useState(null);
    const user = useSelector((state) => state.user.user);
    const [loading, setLoading] = useState(false);
    const { isSuccess : isSSMedical } = useSelector(state => state.medical)
    const { isSuccess : isSSUser} = useSelector(state => state.user);

    useEffect(() => {
        if(isSSUser && user?.username && (!user.phone || !user.fullName)) {
            history && history.push("/profile")
            return;
        }
    }, [isSSUser, isSSMedical, history]);
    const openModal = (item) => {
        setModalVisible(true);
        setRecordUpdate(item);
    };

    React.useEffect(() => {
        const init = async () =>{
            setLoading(true)
           await dispatch(GetAppointment(user))
            setLoading(false)
        }
        if(user?.username) {
            init()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modalVisible, user?.username])

    const closeModal = () => {
        setModalVisible(false);
        setRecordUpdate(null);
    };

    return (
        <div>
            <h2 className="page-header layout">Lịch hẹn bệnh nhân</h2>
            <Spin spinning={loading}>
            <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card__body" style={{ minHeight: 300 }}>
                                {
                                    appointment.length ?
                                        <Table
                                            limit="10"
                                            headData={appointmentTableHead}
                                            renderHead={(item, index) =>
                                                renderHead(item, index)
                                            }
                                            bodyData={appointment}
                                            renderBody={(item, index) =>
                                                renderBody(item, index, history, openModal)
                                            }
                                        /> :
                                        <Empty />
                                }

                            </div>
                            <UpdateAppointment visible={modalVisible} closeModal={closeModal} oldData={recordUpdate} dataList={appointment} />
                        </div>
                    </div>
            </div>
            </Spin>
        </div>
    );
};

export default Appointment;
