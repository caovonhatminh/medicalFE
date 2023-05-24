import { DeleteOutlined, EditOutlined, EyeOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, DatePicker, Empty, message, Modal, Skeleton, Tooltip, Typography } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import Table from "../components/table/Table";
import { axiosAuth } from "../config/axios";
import { filterData, FilterMedicals, GetMedicals, handleChangePage } from "../redux/slices/MedicalSlice";
import UpdateMedical from "./Medical/Update/UpdateMedical";
import { CButton, CInput } from "./Profile";

const renderCustomerHead = (item, index) => <th key={index}>{item}</th>;

const renderCustomerBodySkeleton = () => {
    return <tr>
        <th> <Skeleton.Input active size="small" block /></th>
        <th> <Skeleton.Input active size="small" block /></th>
        <td> <Skeleton.Input active size="small" block /></td>
        <td> <Skeleton.Input active size="small" block /></td>
        <td> <Skeleton.Input active size="small" block /></td>
        <td> <Skeleton.Input active size="small" block /></td>
        <td> <Skeleton.Input active size="small" block /></td>
        <td> <Skeleton.Input active size="small" block /></td>
        <td> <Skeleton.Input active size="small" block /></td>
    </tr>
}

const { Text } = Typography




const Medicals = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [isModalConfirm, setIsModalConfirm] = useState(false);
    const [recordUpdate, setRecordUpdate] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [fullText, setfullText] = useState("");
    const history = useHistory();
    const dispatch = useDispatch()
    const medicalRecent = useSelector(state => state.medical.medicalFilter)
    const { isLoading, isSuccess } = useSelector(state => state.medical)
    let { search } = useLocation();
    const { isDoctor, user } = useSelector(state => state.user)
    const [loading, setLoading] = useState(false);
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
                <th>{item?.stt}</th>
                <td>{moment(item?.createAt).format("DD/MM/YYYY")}</td>
                <td>{moment(item?.updateAt).format("DD/MM/YYYY")}</td>
                <td width={200}>{item?.fullName}</td>
                <td width={200}>{item?.medicalName}</td>
                <td width={300}>{item?.listUser?.join(", ")}</td>
                <td width={100}>{item?.phone}</td>
                <td width={150}>
                    <Text style={{ width: 150 }} ellipsis={{ tooltip: item?.address }} className="txtcolor">
                        {item?.address}
                    </Text>
                </td>
                {/*<td width={100} style={{ textAlign: "center" }}>*/}
                {/*    {item?.medicalResults?.length}*/}
                {/*</td>*/}
                <td align="center">
                    <Tooltip title="Xem chi tiết">
                        <EyeOutlined
                            onClick={() =>
                                history.push(
                                    `/medical/get-medical-record/${item?._id}`
                                )
                            }
                        />
                    </Tooltip>
                </td>
                {isDoctor ? <>
                    {/*<td>*/}
                    {/*    <Tooltip title="Chỉnh sửa">*/}
                    {/*        <EditOutlined onClick={() => openModal(item, "UPDATE")} />*/}
                    {/*    </Tooltip>*/}
                    {/*</td>*/}
                    <td>
                        <Tooltip title="Xoá">
                            <DeleteOutlined onClick={() => openModal(item, "DELETE")} />
                        </Tooltip>
                    </td>
                </>
                    : <>
                        <td></td>
                        <td></td>
                    </>
                }
            </tr >
        );
    };

    const query = new URLSearchParams(search);
    const paramField = query.get('q');

    const handleRollback = () => {
        axiosAuth({
            url: "/medical/update-status-medical-record",
            method: "post",
            data: {
                medicalRecordID: recordUpdate._id,
                status: '1',
            },
        }).then(() => {
            // window.location.reload();
            message.success("Thu hồi thành công")
             dispatch(GetMedicals(user))
        })
    }

    const handleDelete = () => {
        axiosAuth({
            url: "/medical/update-status-medical-record",
            method: "post",
            data: {
                medicalRecordID: recordUpdate._id,
                status: '0',
            },
        }).then(() => {
            // window.location.reload();
            message.success(<div>
                <span>Xoá thành công</span>{" "}
                <Button type="ghost" icon={<ReloadOutlined />} onClick={handleRollback}><span className="layout">thu hồi</span></Button>
            </div>)
             dispatch(GetMedicals(user))
        })

        hideModal()
    }

    const openModal = (item, action) => {
        setRecordUpdate(item);

        switch (action) {
            case "UPDATE": {
                setModalVisible(true);
                break;
            }
            case "DELETE": {
                setIsModalConfirm(true);
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

    useEffect(() => {
        dispatch(GetMedicals(user))
        // if (paramField) {
        //     console.log('====================================');
        //     console.log(paramField);
        //     console.log('====================================');
        //     dispatch(FilterMedicals({ fullText: paramField }))
        // } else {
        // }
    }, [user]);

    // useEffect(() => {
    //     onChangePagination(1)
    // }, [medicalRecent]);

    const handleChangeStartDate = (date) => {
        if (date) {
            setStartDate(date)
        } else {
            setStartDate(null);
        }
    };

    const handleChangeEndDate = (date) => {
        if (date) {
            setEndDate(date)
        } else {
            setEndDate(null);
        }
    };

    const handleClearData = () => {
        dispatch(GetMedicals(user))
        setStartDate("")
        setEndDate("")
        setfullText("")
    }

    const handleFilter = () => {
        if(fullText.toLocaleLowerCase() == "") {
             dispatch(GetMedicals(user))
            return;
        }
        const data = {
            text_search: fullText.toLocaleLowerCase(),
        };
        setLoading(true)
        dispatch(filterData(data))
        setTimeout(() => {
            setLoading(false)
        }, [200])
    };

    const medicalRecentSkeleton = [1, 2, 3, 4, 5, 1, 2, 3, 4, 5,]

    return (
        <div>
            <h2 className="page-header layout">Bệnh án gần đây</h2>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card__header">
                            <div className="row">
                                <div
                                    className="col-2"
                                >
                                    <CButton
                                        width="110px"
                                        onClick={handleClearData}
                                    >
                                        <ReloadOutlined /> Làm mới
                                    </CButton>
                                </div>
                                <div
                                    className="col-10"
                                    style={{ textAlign: "end" }}
                                >
                                    <WrapperRight>
                                        {/* <DRangePicker
                                            value={startDate ? moment(startDate) : ""}
                                            format="DD/MM/YYYY"
                                            onChange={handleChangeStartDate}
                                            placeholder="Bắt đầu"
                                        />
                                        <DRangePicker
                                            value={endDate ? moment(endDate) : ""}
                                            format="DD/MM/YYYY"
                                            onChange={handleChangeEndDate}
                                            placeholder="Kết thúc"
                                        /> */}
                                        <WrapperInput>
                                            <CInput
                                                style={{ paddingRight: "45px" }}
                                                height="40px"
                                                placeholder="Tìm tên bệnh nhân, sđt"
                                                value={fullText}
                                                onChange={(e) =>
                                                    setfullText(e.target.value)
                                                }
                                                onPressEnter={handleFilter}
                                            />
                                            <BoxSearch>
                                                <SearchOutlined onClick={handleFilter} />
                                            </BoxSearch>
                                        </WrapperInput>
                                        <CButton
                                            width="150px"
                                            onClick={handleFilter}
                                        >
                                            Lọc
                                        </CButton>
                                        {
                                            isDoctor && <CButton
                                                width="150px"
                                                onClick={() =>
                                                    history.push("/medicals/create")
                                                }
                                            >
                                                Thêm mới
                                            </CButton>
                                        }
                                    </WrapperRight>
                                </div>
                            </div>
                        </div>
                        <div className="card__body">
                            <Table
                                headData={[
                                    "#",
                                    "Ngày vào",
                                    "Cập nhật",
                                    "Bệnh nhân",
                                    "Bệnh",
                                    "Bác sĩ",
                                    "SĐT",
                                    "Đ/C",
                                    "",
                                    "",
                                ]}
                                renderHead={(item, index) =>
                                    renderCustomerHead(item, index)
                                }
                                limit="10"
                                bodyData={(isLoading || loading) ? medicalRecentSkeleton : medicalRecent}
                                renderBody={(item, index) =>
                                    (isLoading || loading) ? renderCustomerBodySkeleton() : renderCustomerBody(
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
                onOk={handleDelete}
                onCancel={hideModal}
                okText="Xác nhận"
                cancelText="Huỷ"
            >
                Xác nhận <strong style={{ color: 'red' }}>xoá</strong> bệnh án: <strong>{recordUpdate?.medicalName}</strong>
            </Modal>
        </div>
    );
};

export default Medicals;

const WrapperRight = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 15px;
`;

const DRangePicker = styled(DatePicker)`
    height: 40px;
    width: 150px;
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
