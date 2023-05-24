import React, { useState } from "react";
import Table from "../components/table/Table";
import moment from "moment";
import { Empty, Form, Image, message, Modal, Radio, Row, Tooltip, Typography } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { CButton, CInput } from "./Profile";
import Register from "./Register";
import { axiosAuth } from "../config/axios";
import { getLinkAvatar, getLinkImage } from "../constants";
import { DeleteOutlined } from '@ant-design/icons';

export const getRoleString = (role) => {
    switch (role) {
        case 'admin': return 'Admin';
        case 'bs': return 'Bác sĩ';
        default: return 'Y tá'
    }
}
const appointmentTableHead = ["#", "Hình ảnh", "Username", "Tên", "Ngày sinh", "SĐT", "Địa chỉ", "Chức vụ", "", ""];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const { Text } = Typography
const renderBody = (item, index, history, openModal) => (
    <tr key={index}>
        <th width={50}>{item.stt}</th>
        <td width={100}><Image src={item?.avatar ? getLinkAvatar(item?.avatar) : ''} style={{ width: 100 }} /></td>
        <td width={150} style={{ textTransform: 'none' }}>{item?.username}</td>
        <td>{item?.fullName}</td>
        <td width={150}>{item?.birthday ? moment(item?.birthday).format("DD/MM/YYYY") : ''}</td>
        <td width={150}>{item?.phone}
            {/* {
            item.phone ?
                <Row align="middle" style={{ gap: '10px' }}>
                    <PhoneOutlined style={{ fontSize: '22px' }} onClick={() => window.open(`tel:${item.phone}`)} />
                    <ZaloIcon onClick={() => window.open(`https://zalo.me/${item.phone}`)} />
                </Row> : <></>
        } */}
        </td>
        <td>
            <Text style={{ width: 150 }} ellipsis={{ tooltip: item?.address }} className="txtcolor">
                {item?.address}
            </Text>
        </td>
        <td width={100}>
            {getRoleString(item?.role)}
        </td>
        {/* <td width={20}>
            <Tooltip title="Cập nhật">
                <EditOutlined onClick={() => openModal(item, "UPDATE")} />
            </Tooltip>
        </td> */}
        <td width={20}>
            <Tooltip title="Xoá">
                <DeleteOutlined
                    onClick={() => openModal(item, "DELETE")}
                />
            </Tooltip>
        </td>
    </tr>
);

const Management = () => {
    const history = useHistory()
    const [modalVisible, setModalVisible] = useState(false);
    const dispatch = useDispatch()
    const [itemUser, setItemUser] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [users, setUsers] = useState([]);
    const [deleteModal, setDeleteModal] = useState(false);

    const openModal = (item, action) => {
        switch (action) {
            case "UPDATE":
                setModalVisible(true);
                break;
            case "DELETE":
                setDeleteModal(true);
                break;

            default:
                setDeleteModal(true);
        }
        setItemUser(item);
    };

    const init = async () => {
        try {
            const response = await axiosAuth({
                url: "/user/get-users",
                method: "get",
            })

            const list = response.data.data.filter(({role})=> role !== 'admin');
            setUsers(list)
        } catch (error) {
            message.error("Lỗi")
        }
    }
    React.useEffect(() => {
        init()
    }, [modalVisible, isVisible])

    const closeModal = () => {
        setModalVisible(false);
        setDeleteModal(false);
        setItemUser(null);
    };

    const handleOk = async () => {
        await axiosAuth({
            url: "/user/delete",
            method: "post",
            data: {
                _id: itemUser._id
            }
        })
        closeModal()
        init()
    };

    const handleUpdate = async (values) => {
        axiosAuth({
            url: "/user/update",
            method: "post",
            data: {
                _id: itemUser._id,
                ...itemUser,
                birthday: itemUser?.birthday ? moment(itemUser?.birthday).format("DD/MM/YYY") : '',
                ...values,
                date: moment(values.date).format("DD/MM/YYYY")
            },
        })
            .then(() => {
                // window.location.href = "/";
                message.success("Cập nhật thành công");
            })
            .catch((error) => {
                console.log(error);
            });
        closeModal()
        init()
    };

    return (
        <div>
            <h2 className="page-header layout">Quản lý tài khoản</h2>
            <Register isVisible={isVisible} setIsVisible={setIsVisible} />
            <Modal title="Xác nhận" open={deleteModal} onCancel={closeModal} onOk={handleOk}>
                Xác nhận <strong style={{ color: 'red' }}>xoá</strong> tài khoản: <strong>{itemUser?.fullName}</strong>
            </Modal>
            <Modal title="Cập nhật" open={modalVisible} onCancel={closeModal} footer={null}>
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    // onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    onFinish={handleUpdate}
                    // onSubmitCapture={handleUpdate}
                    initialValues={
                        {
                            fullName: itemUser?.fullName,
                            role: itemUser?.role
                        }
                    }
                    destroyOnClose
                >
                    <Form.Item
                        label="Tên"
                        name="fullName"
                        initialValue={itemUser?.fullName}
                    >
                        {itemUser?.fullName}
                        {/* <CInput disabled value={itemUser?.fullName} /> */}
                    </Form.Item>
                    <Form.Item
                        label="Chức vụ"
                        name="role"
                        initialValue="bs"
                    >
                        <Radio.Group>
                            <Radio value="bs">Bác sĩ</Radio>
                            <Radio value="yt">Y tá</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{ offset: 8, span: 16 }}
                    >
                        <CButton
                            type="primary"
                            htmlType="submit"
                        >
                            Cập nhật
                        </CButton>
                    </Form.Item>
                </Form>
            </Modal>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="col-12" style={{ textAlign: "end" }}>
                            <CButton
                                width="150px"
                                onClick={() =>
                                    setIsVisible(true)
                                }
                            >
                                Thêm mới
                            </CButton>
                        </div>
                        <div className="card__body" style={{ minHeight: 300 }}>
                            {
                                users.length ?
                                    <Table
                                        limit="10"
                                        headData={appointmentTableHead}
                                        renderHead={(item, index) =>
                                            renderHead(item, index)
                                        }
                                        bodyData={users}
                                        renderBody={(item, index) =>
                                            renderBody(item, index, history, openModal)
                                        }
                                    /> :
                                    <Empty />
                            }

                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Management;
