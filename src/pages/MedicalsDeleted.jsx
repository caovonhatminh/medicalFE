import { DeleteOutlined, EyeOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { DatePicker, Empty, message, Modal, Skeleton, Tooltip, Typography } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Table from "../components/table/Table";
import { axiosAuth } from "../config/axios";
import { FilterMedicals, GetMedicals } from "../redux/slices/MedicalSlice";
import UpdateMedical from "./Medical/Update/UpdateMedical";
import { CButton, CInput } from "./Profile";

const renderCustomerBodySkeleton = () => {
    return <tr>
        <th> <Skeleton.Input active size="small" block /></th>
        <th> <Skeleton.Input active size="small" block /></th>
        <td> <Skeleton.Input active size="small" block /></td>
        <td> <Skeleton.Input active size="small" block /></td>
        <td> <Skeleton.Input active size="small" block /></td>
        <td> <Skeleton.Input active size="small" block /></td>
        <td> <Skeleton.Input active size="small" block /></td>
    </tr>
}

const renderCustomerHead = (item, index) => <th key={index}>{item}</th>;


const { RangePicker } = DatePicker;
const { Text } = Typography

const MedicalsDeleted = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [isModalConfirm, setIsModalConfirm] = useState(false);
    const [isModalDelete, setIsModalDelete] = useState(false);
    const [recordUpdate, setRecordUpdate] = useState(null);
    const [filterDate, setFilterDate] = useState(["", ""]);
    const [fullText, setfullText] = useState("");
    const history = useHistory();
    const dispatch = useDispatch()
    const medicalRecent = useSelector(state => state.medical.medicalDeleted)
    const { isLoading } = useSelector(state => state.medical)
    const { isDoctor } = useSelector(state => state.user)
    const { user } = useSelector((state) => state.user);
    const { isSuccess : isSSMedical } = useSelector(state => state.medical)
    const { isSuccess : isSSUser} = useSelector(state => state.user);

    useEffect(() => {
        if(isSSUser && user?.username && (!user.phone || !user.fullName)) {
            history && history.push("/profile")
            return;
        }
    }, [isSSUser, isSSMedical, history]);

    const renderCustomerBody = (item, index, history, openModal) => {
        return (
            <tr key={index}>
                <th>{item.stt}</th>
                <td>{moment(item.createAt).format("DD/MM/YYYY")}</td>
                <td>{moment(item?.updateAt).format("DD/MM/YYYY")}</td>
                <td >{item?.auth}</td>
                <td width={300}>{item?.fullName}</td>
                <td width={300}>{item?.medicalName}</td>
                <td width={100}>{item?.phone}</td>
                <td width={150}>
                    <Text style={{ width: 150 }} ellipsis={{ tooltip: item?.address }} className="txtcolor">
                        {item?.address}
                    </Text>
                </td>
                <td width={100} style={{ textAlign: "center" }}>
                    {item?.medicalResults?.length}
                </td>
                <td>
                    <Tooltip title="Xem chi tiết">
                        <EyeOutlined
                            onClick={() =>
                                history.push(
                                    `/medical-deleted/get-medical-record/${item._id}`
                                )
                            }
                        />
                    </Tooltip>
                </td>
                {
                    isDoctor ? <>
                        <td>
                            <Tooltip title="Thu hồi">
                                <ReloadOutlined onClick={() => openModal(item, "ROLLBACK")} />
                            </Tooltip>
                        </td>
                        <td>
                            <Tooltip title="Xoá vĩnh viễn">
                                <DeleteOutlined onClick={() => openModal(item, "DELETE_ALWAY")} />
                            </Tooltip>
                        </td>
                    </> : <></>
                }

            </tr>
        );
    };


    const handleRollback = () => {
        axiosAuth({
            url: "/medical/update-status-medical-record",
            method: "post",
            data: {
                medicalRecordID: recordUpdate._id,
                status: "1",
            },
        }).then(() => {
            // window.location.reload();
            message.success("Thu hồi thành công")
            dispatch(GetMedicals(user))
            hideModal()
        })
    }

    const handleDeleteAlways = () => {
        axiosAuth({
            url: "/medical/update-status-medical-record",
            method: "post",
            data: {
                medicalRecordID: recordUpdate._id,
                updateAt: new Date(),
                status: "2",
            },
        }).then(() => {
            // window.location.reload();
            message.success("Xoá vĩnh viễn thành công")
            dispatch(GetMedicals(user))
            hideModalDelete()
        })
    }

    const openModal = (item, action) => {
        setRecordUpdate(item);

        switch (action) {
            case "UPDATE": {
                setModalVisible(true);
                break;
            }
            case "ROLLBACK": {
                setIsModalConfirm(true);
                break;
            }
            case "DELETE_ALWAY": {
                setIsModalDelete(true);
                break;
            }
            default:
                break;
        }
    };

    const closeModal = () => {
        setModalVisible(false);
        setRecordUpdate(null);
    };


    const hideModal = () => {
        setModalVisible(false);
        setIsModalConfirm(null);
    };

    const hideModalDelete = () => {
        setIsModalDelete(false);
        setRecordUpdate(null);
    };

    useEffect(() => {
        dispatch(GetMedicals(user))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    useEffect(() => {
        onChangePagination(1)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [medicalRecent]);

    const handleChangeDate = (dates) => {
        if (dates.length > 0) {
            dates = dates.map((element) => {
                return element.format("DD/MM/YYYY");
            });
            setFilterDate(dates);
        } else {
            setFilterDate(["", ""]);
        }
    };


    const handleFilter = () => {
        const data = {
            fromDate: filterDate[0],
            toDate: filterDate[1],
            fullText,
        };

        dispatch(FilterMedicals(data))
    };


    const onChangePagination = (pageNumber) => {
    }
    const medicalRecentSkeleton = [1, 2, 3, 4, 5, 1, 2, 3, 4, 5,]

    return (
        <div>
            <h2 className="page-header layout">Bệnh án đã xoá</h2>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card__header">
                            <div className="row">
                                <div className="col-3">
                                    <WrapperInput>
                                        <CInput
                                            style={{ paddingRight: "45px" }}
                                            height="40px"
                                            placeholder="Tìm tên bênh, bệnh viện, thuốc ..."
                                            onChange={(e) =>
                                                setfullText(e.target.value)
                                            }
                                        />
                                        <BoxSearch>
                                            <SearchOutlined />
                                        </BoxSearch>
                                    </WrapperInput>
                                </div>
                                <div
                                    className="col-9"
                                    style={{ textAlign: "end" }}
                                >
                                    <WrapperRight>

                                        <DRangePicker
                                            onChange={handleChangeDate}
                                        />
                                        <CButton
                                            width="150px"
                                            onClick={handleFilter}
                                        >
                                            Lọc
                                        </CButton>
                                        {/* <CButton
                                            width="150px"
                                            onClick={() =>
                                                history.push("/medicals/create")
                                            }
                                        >
                                            Thêm mới
                                        </CButton> */}
                                    </WrapperRight>
                                </div>
                            </div>
                        </div>
                        <div className="card__body">
                            <Table
                                headData={[
                                    "#",
                                    "Ngày vào",
                                    "Gần nhất",
                                    "Bệnh nhân",
                                    "Bệnh",
                                    "SĐT",
                                    "Đ/C",
                                    "SL",
                                    "",
                                    "",
                                    "",
                                ]}
                                renderHead={(item, index) =>
                                    renderCustomerHead(item, index)
                                }
                                limit="10"
                                bodyData={isLoading ? medicalRecentSkeleton : medicalRecent}
                                renderBody={(item, index) =>
                                    isLoading ? renderCustomerBodySkeleton() : renderCustomerBody(
                                        item,
                                        index,
                                        history,
                                        openModal
                                    )
                                }
                            />
                            {
                                medicalRecent.length === 0 ? <Empty /> : <></>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <UpdateMedical visible={modalVisible} closeModal={closeModal} oldData={recordUpdate} />
            <Modal
                title="Xác nhận"
                open={isModalConfirm}
                onOk={handleRollback}
                onCancel={hideModal}
                okText="Xác nhận"
                cancelText="Huỷ"
            >
                Xác nhận <strong style={{ color: '#1986ec' }}>thu hồi</strong> bệnh án: <strong>{recordUpdate?.medicalName}</strong>
            </Modal>
            <Modal
                title="Xác nhận"
                open={isModalDelete}
                onOk={handleDeleteAlways}
                onCancel={hideModalDelete}
                okText="Xác nhận"
                cancelText="Huỷ"
            >
                Xác nhận <strong style={{ color: '#f11810' }}>XOÁ VĨNH VIỄN</strong> bệnh án: <strong>{recordUpdate?.medicalName}</strong>
            </Modal>
        </div>
    );
};

export default MedicalsDeleted;

const WrapperRight = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 15px;
`;

const DRangePicker = styled(RangePicker)`
    height: 40px;
    width: 300px;
    padding: 10px 10px 10px 20px;
    font-size: 1rem;
    box-sizing: border-box;
    border-radius: var(--border-radius);
    color: var(--txt-color);
    background-color: var(--main-bg);
    box-shadow: var(--box-shadow);
    border: 2px solid transparent;

    &:hover {
        border: 2px solid var(--main-color);;
    }

    .ant-picker-input {
        input {
            border: none;
            color: var(--txt-color);
        }
    }
    .ant-picker-suffix {
        color: var(--txt-color);
    }

    .ant-picker-status-error.ant-picker,
    .ant-picker-status-error.ant-picker:not([disabled]):hover {
        background-color: var(--main-bg) !important;
    }
`;

const WrapperInput = styled.div`
    position: relative;
`;

const BoxSearch = styled.div`
    position: absolute;
    right: 1px;
    top: 1px;
    width: 38px;
    height: 38px;
    border-radius: 14px;
    background-color: var(--main-color);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    cursor: pointer;
    color: white;
    
`;
