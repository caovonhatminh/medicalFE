import {Form, message, Modal, Skeleton, Tooltip, Upload, Row, Button} from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Table from "../components/table/Table";
import { axiosAuth } from "../config/axios";
import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    PhoneOutlined,
    PlusCircleOutlined, PrinterOutlined,
    ReloadOutlined
} from "@ant-design/icons";
import { Space } from "antd";
import { CButton, CInput, DInput } from "./Profile";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper";
import styled from "styled-components";
import Viewer from "react-viewer";
import { CreateRecordResult } from "./Medical/Create/CreateMedicalResult";
import { getLinkImage } from "../constants";
import { CreateMedicalExamination } from "./Medical/Create/CreateMedicalExamination";
import CreateMedicines from "./Medical/Create/CreateMedicines";
import { useSelector } from "react-redux";
import {GetMedicals} from "../redux/slices/MedicalSlice";

const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
        message.error("You can only upload JPG/PNG file!");
        return true;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error("Image must smaller than 2MB!");
        return true;
    }

    return false;
};

const renderCusomerHead = (item, index) => (
    <th key={index} style={{ textAlign: "center" }}>
        {item}
    </th>
);

const MedicalRecord = () => {
    const { id } = useParams();
    const [medicalRecord, setMedicalRecord] = useState(null);
    const [medicalRecordResult, setMedicalRecordResult] = useState([]);
    const [dataModal, setDataModal] = useState();
    const [isOpenImage, setIsOpenImage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const history = useHistory();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [listImage, setListImage] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [isVisibleCreate, setIsVisibleCreate] = useState(false);
    const [isVisibleCreateExam, setIsVisibleCreateExam] = useState(false);
    const [isVisibleCreateMedicines, setIsVisibleCreateMedicines] =
        useState(false);
    const [resultUpdate, setResultUpdate] = useState(null);
    const [resultNew, setResultNew] = useState(null);
    const [fileList, setFileList] = useState([]);
    const { isDoctor } = useSelector(state => state.user)
    const [isModalConfirm, setIsModalConfirm] = useState(false);

    const renderCustomerBody = (
        item,
        index,
        showModal,
        handleSetListImage,
        history,
        openModal,
        openShowCreateExam,
        openShowCreateMedicines
    ) => {
        return (
            <tr key={item?._id}>
                <th>{item.stt}</th>
                <td style={{ textAlign: "center" }}>{moment(item.date).format("DD/MM/YYYY")}</td>
                <td style={{ textAlign: "center" }}>{ item.appointment ? moment(item.appointment).format("HH:mm DD/MM/YYYY") : 'Không'}</td>
                <td width={200} style={{ textAlign: "center" }}>
                    {
                        item?.medicineImage ? <Space>
                                <img
                                    width={80}
                                    height={100}
                                    style={{ objectFit: "cover" }}
                                    src={getLinkImage(item.medicineImage)}
                                    alt="thuoc"
                                    onClick={() =>
                                        handleSetListImage([
                                            { src: getLinkImage(item.medicineImage) },
                                        ])
                                    }
                                />
                                <PrinterOutlined style={{fontSize: 20}} onClick={() => window.open(getLinkImage(item.medicineImage))} />
                            </Space>
                        : "Trống"
                    }
                </td>
                <td style={{ textAlign: "center" }}>{item.finalResult}</td>
                <td width={200} style={{ textAlign: "center" }}>
                    <Space size="middle">
                        <Tooltip title="Số mục khám">
                            ({item.results.length})
                        </Tooltip>
                        {item.results.length ? (
                            <Tooltip title="Xem chi tiết">
                                <EyeOutlined
                                    onClick={() =>
                                        showModal({ data: item.results, type: 0 })
                                    }
                                    width={100}
                                />
                            </Tooltip>
                        ) : (
                            <></>
                        )}
                        <Tooltip title="Thêm">
                            {
                                index == 0  && isDoctor ? <PlusCircleOutlined
                                    onClick={() => openShowCreateExam(item)}
                                /> : <></>
                            }

                        </Tooltip>
                    </Space>
                </td>
                <td width={200} style={{ textAlign: "center" }}>
                    <Space size="middle">
                        {
                            item.medicines.length > 0 && <Tooltip title="Số toa">({item.medicines.length})</Tooltip>
                        }
                        {item.medicines ? (
                            <Tooltip title="Xem chi tiết">
                                <EyeOutlined
                                    onClick={() =>
                                        showModal({ data: item.medicines, type: 1 })
                                    }
                                    width={100}
                                />
                            </Tooltip>
                        ) : (
                            <></>
                        )}
                        {
                            index == 0  && isDoctor ? <Tooltip title="Thêm">
                                <PlusCircleOutlined
                                    onClick={() => openShowCreateMedicines(item)}
                                />
                            </Tooltip> : <></>
                        }

                    </Space>
                </td>
                <td width={50} style={{ textAlign: "center" }}>
                    {
                        isDoctor ?  <Tooltip title="Xoá">
                            <DeleteOutlined onClick={() => openModal(item, "DELETE")} />
                        </Tooltip> : <></>
                    }

                </td>
            </tr>
        );
    };


    const onChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const closeModalCreate = () => {
        setIsVisibleCreate(false);
    };

    const openModal = (item) => {
        setModalVisible(true);
        setResultUpdate(item);
        setFileList([
            {
                uid: "-1",
                name: "image.png",
                status: "done",
                url: getLinkImage(item.medicineImage),
            },
        ]);
    };

    const closeModal = () => {
        setModalVisible(false);
        setResultUpdate(null);
    };

    const showModal = (data) => {
        setIsModalOpen(true);
        setDataModal(data);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleCancelImage = () => {
        setIsOpenImage(false);
    };

    const handleUpdate = (values) => {
        const formData = new FormData();
        formData.append('_id', resultUpdate._id)
        for (let [key, value] of Object.entries(values)) {
            if (!value) continue;
            switch (key) {
                case "medicineImage": {
                    if (fileList.length >= 1 && fileList[0]?.uid !== "-1") formData.append("medicineImage", fileList[0]?.originFileObj, fileList[0]?.originFileObj?.name);
                    break;
                }
                case "appointment": {
                    formData.append("appointment", value.format('DD/MM/YYYY'));
                    break;
                }
                case "date": {
                    formData.append("date", value.format('DD/MM/YYYY'));
                    break;
                }
                default:
                    formData.append(key, value);
            }
        }

        axiosAuth({
            url: "/medical/update-medical-result",
            method: "post",
            data: formData,
        }).then(() => {
            // window.location.reload();
            message.success('Cập nhật thành công')
            setModalVisible(false)
        })
            .then(() => {
                // window.location.reload();
                message.success("Cập nhật thành công");
                setModalVisible(false);
            })
            .catch((error) => console.log(error));
    };
    const openShowCreateExam = (data) => {
        setIsVisibleCreateExam(true);
        setResultNew({ data });
    };

    const openShowCreateMedicines = (data) => {
        setIsVisibleCreateMedicines(true);
        setResultNew({ data });
    };
    const init = () => {
        axiosAuth({
            url: `/medical/get-medical-record/?_id=${id}`,
            method: "get",
        })
            .then(async (result) => {
                setMedicalRecord(result.data.data);
                const { data } = await axiosAuth({
                    url: `/medical/get-medical-result?medicalRecordID=${id}`,
                    method: "get",
                });
                data.data = data.data.filter(item => item?.status !== "0")
                data.data = data.data.sort(
                    (a, b) =>
                        new moment(b.date).format("YYYYMMDD") -
                        new moment(a.date).format("YYYYMMDD")
                );

                setMedicalRecordResult(data.data);
                setIsLoading(false);
            })
            .catch((e) => {
                console.log(e);
                setIsLoading(false);
            });
    }

    useEffect(() => {
        if (!medicalRecordResult.length) {
            setIsLoading(true);
        }

        init();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, isVisibleCreate, isVisibleCreateExam, modalVisible, isVisibleCreateMedicines]);

    const handleSetListImage = (list) => {
        setListImage(list);
        setIsOpenImage(true);
    };

    const nextStepCreateRecord = (result) => {
        setIsVisibleCreate(false)
        // setIsVisibleCreateExam(true)
        setResultNew(result)
    }

    const handleDelete = () => {
        axiosAuth({
            url: "/medical/update-status-medical-result",
            method: "post",
            data: {
                medicalResultID: resultUpdate._id,
                status: '0',
            },
        }).then(() => {
            // window.location.reload();
            message.success('Xoá thành công')
        })

        hideModal()
    }


    const hideModal = () => {
        setModalVisible(false);
        setIsModalConfirm(null);
        init();
    };
    return (
        <div>
            <Modal
                title="Xác nhận"
                open={modalVisible}
                onOk={handleDelete}
                onCancel={hideModal}
                okText="Xác nhận"
                cancelText="Huỷ"
            >
                Xác nhận <strong style={{ color: 'red' }}>xoá</strong> kết quả khám
                <br />
                <small>(Không thể thu hồi)</small>
            </Modal>
            <Viewer
                images={listImage}
                visible={isOpenImage}
                onClose={handleCancelImage}
                onMaskClick={handleCancelImage}
            />
            <div className="row" id="modalMount">
                <div className="col-12">
                    <div className="card">
                        <div className="card__header">
                            <div className="row">
                                <div className="col-12">
                                    <Title>Chi tiết bệnh án</Title>
                                </div>
                            </div>
                        </div>
                        <div className="card__body">
                            {isLoading ? <Skeleton active /> : medicalRecord && (
                                <Space direction="vertical">

                                    <div className="row">
                                        <div className="col-8 inline">
                                            <Title>Tên bệnh nhân:</Title>{" "}
                                            <strong>
                                                {medicalRecord.fullName}
                                            </strong>
                                        </div>
                                        <div className="col-4">
                                            <Title>Ngày tạo:</Title>{" "}
                                            <strong>
                                                {moment(
                                                    medicalRecord.createAt
                                                ).format("DD/MM/YYYY")}
                                            </strong>
                                        </div>
                                        <div className="col-8 inline">
                                            <Title>Tên bệnh:</Title>{" "}
                                            <strong>
                                                {medicalRecord.medicalName}
                                            </strong>
                                        </div>
                                        <div className="col-4">
                                            <Title>Cập nhật ngày:</Title>{" "}
                                            <strong>
                                                {moment(
                                                    medicalRecord.updateAt
                                                ).format("DD/MM/YYYY")}
                                            </strong>
                                        </div>
                                        <div className="col-8 inline">
                                            <Title>Số điện thoại:</Title>{" "}
                                            <strong>
                                                {medicalRecord.phone}
                                            </strong>
                                        </div>
                                        <div className="col-4">
                                            <Title> Số lần khám:</Title>{" "}
                                            <strong>
                                                {
                                                    medicalRecordResult
                                                        ?.length
                                                }
                                            </strong>
                                        </div>
                                        <div className="col-8 inline">
                                            <Title>Địa chỉ:</Title>{" "}
                                            <strong>
                                                {medicalRecord.address}
                                            </strong>
                                        </div>
                                    </div>
                                </Space>
                            )}
                            <div style={{ height: "50px", textAlign: "end" }}>
                                {isLoading ? (
                                    <Skeleton.Button />
                                ) : (

                                    isDoctor && <CButton
                                        width="150px"
                                        onClick={() => setIsVisibleCreate(true)}
                                    >
                                        Thêm mới
                                    </CButton>
                                )}
                            </div>
                            {isLoading ? (
                                <Skeleton />
                            ) : (
                                <Table
                                    limit="10"
                                    headData={[
                                        "#",
                                        "Ngày khám",
                                        "Ngày hẹn",
                                        "Hình ảnh",
                                        "Chuẩn đoán",
                                        "Khám khác",
                                        "Toa thuốc",
                                        "",
                                    ]}
                                    renderHead={(item, index) =>
                                        renderCusomerHead(item, index)
                                    }
                                    bodyData={medicalRecordResult}
                                    renderBody={(item, index) =>
                                        renderCustomerBody(
                                            item,
                                            index,
                                            showModal,
                                            handleSetListImage,
                                            history,
                                            openModal,
                                            openShowCreateExam,
                                            openShowCreateMedicines
                                        )
                                    }
                                />
                            )}
                        </div>

                        {/* <div className="card__footer">
                            <PaginationAntd onChange={onChangePagination} total={medicalRecordResultPage.length} />
                        </div> */}
                    </div>
                </div>
                <Modal
                    getContainer="#modalMount"
                    zIndex={100}
                    centered
                    title={
                        dataModal?.type === 0
                            ? "Chi tiết liên quan"
                            : "Chi tiết toa thuốc"
                    }
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={[]}
                >
                    <Swiper
                        pagination={{
                            type: "fraction",
                        }}
                        modules={[Navigation, Pagination, Mousewheel, Keyboard]}
                        navigation={true}
                        className="mySwiper"
                        allowTouchMove={false}
                    >
                        {dataModal?.type === 0
                            ? dataModal?.data?.map((item) => (
                                <SwiperSlide>
                                    <h2
                                        style={{
                                            height: "60px",
                                            textAlign: "center",
                                        }}
                                    >
                                        {item.name}
                                    </h2>
                                    <img
                                        width="100%"
                                        height={300}
                                        src={getLinkImage(item.image)}
                                        alt="benh"
                                        onClick={() =>
                                            handleSetListImage(
                                                dataModal?.data?.map((x) => {
                                                    return {
                                                        src: getLinkImage(
                                                            x.image
                                                        ),
                                                    };
                                                })
                                            )
                                        }
                                    />
                                    <h3
                                        style={{
                                            height: "100px",
                                            marginTop: "20px",
                                        }}
                                    >
                                        Kết quả: {item.result}
                                    </h3>
                                </SwiperSlide>
                            ))
                            : dataModal?.data?.map((item) => (
                                <SwiperSlide>
                                    <h2
                                        style={{
                                            height: "60px",
                                            textAlign: "center",
                                        }}
                                    >
                                        {item.name}
                                    </h2>
                                    <div
                                        style={{
                                            padding: "0 50px 20px  70px",
                                        }}
                                    >
                                        <h3>

                                            <div style={{ width: '100px', display: 'inline-block' }}>
                                                Số lượng:
                                            </div>
                                            <strong>{item.quantity}
                                            </strong>
                                        </h3>
                                        <p>
                                            <div style={{ width: '100px', display: 'inline-block' }}>
                                                Cách uống:
                                            </div>
                                            <strong>
                                                {item.isAfter
                                                    ? "Sau khi ăn"
                                                    : "Trước khi ăn"}
                                            </strong>
                                        </p>
                                        <p>
                                            <div style={{ width: '100px', display: 'inline-block' }}>
                                                Sáng:
                                            </div>
                                            <strong>
                                                {item.morning || 0}
                                            </strong>
                                        </p>
                                        <p>
                                            <div style={{ width: '100px', display: 'inline-block' }}>
                                                Trưa:
                                            </div>
                                            <strong>
                                                {item.afternoon || 0}
                                            </strong>
                                        </p>
                                        <p>
                                            <div style={{ width: '100px', display: 'inline-block' }}>
                                                Tối:
                                            </div>
                                            <strong>
                                                {item.night || 0}
                                            </strong>
                                        </p>
                                    </div>
                                </SwiperSlide>
                            ))}
                    </Swiper>
                </Modal>
                <Modal
                    destroyOnClose
                    centered
                    title="Cập nhật khám bệnh"
                    // open={modalVisible}
                    onCancel={closeModal}
                    footer={null}
                >
                    <Form
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        // onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        style={{ marginRight: "50px" }}
                        initialValues={{
                            ...resultUpdate,
                            date: moment(resultUpdate?.date),
                            appointment: resultUpdate?.appointment ? moment(resultUpdate?.appointment) : "",
                        }}
                        // onSubmitCapture={handleUpdate}
                        onFinish={handleUpdate}
                    >
                        <Form.Item
                            label="Ngày khám"
                            name="date"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập thông tin",
                                },
                            ]}
                        >
                            <DInput format="DD/MM/YYYY" />
                        </Form.Item>
                        <Form.Item
                            label="Lịch hẹn"
                            name="appointment"
                        >
                            <DInput
                                format="DD/MM/YYYY"

                                placeholder="Chọn lịch hẹn"
                                disabledDate={(current) => {
                                    return moment().add(0, 'days') >= current
                                }}
                            />
                        </Form.Item>
                        {/* <Form.Item label="Tên bệnh nhân" name="fullName">
                            <CInput
                                name="fullName"
                                placeholder="Tên bệnh nhân"
                            />
                        </Form.Item>
                        <Form.Item label="SĐT liên hệ" name="phone" rules={[{
                            message: "Vui lòng nhập đúng Số điện thoại",
                            pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g
                        }]}>
                            <CInput
                                name="phone"
                                placeholder="Số điện thoại"
                            />
                        </Form.Item> */}
                        {/* <Form.Item
                            label="Xem"
                        >
                            <FlexCenter>
                                <Image src={getLinkImage(resultUpdate?.medicineImage)} width={200} />
                            </FlexCenter>
                        </Form.Item> */}
                        <Form.Item
                            label="Hình ảnh"
                            name="medicineImage"
                        >
                            {/* <CInput type="image" /> */}
                            <CUpload
                                accept="image/png, image/gif, image/jpeg"
                                listType="picture-card"
                                fileList={fileList}
                                onChange={onChange}
                                beforeUpload={beforeUpload}
                            >
                                {fileList.length < 1 && "+ Upload"}
                            </CUpload>
                        </Form.Item>
                        <Form.Item
                            label="Kết quả khám"
                            name="finalResult"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập thông tin",
                                },
                            ]}
                        >
                            <CInput />
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <CButton type="primary" htmlType="submit">
                                Cập nhật
                            </CButton>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal destroyOnClose centered title="Thêm lần khám bệnh" open={isVisibleCreate} onCancel={closeModalCreate} footer={null}>
                    <CreateRecordResult isShowModal={isVisibleCreate} nextStep={nextStepCreateRecord} medicalRecordID={id} setMedicalResultID={() => 0} />
                </Modal>
                <Modal
                    destroyOnClose
                    centered
                    title="Thêm lần khám"
                    open={isVisibleCreateExam}
                    onCancel={() => setIsVisibleCreateExam(false)}
                    footer={null}
                >
                    <CreateMedicalExamination
                        isModal={true}
                        nextStep={() => setIsVisibleCreateExam(false)}
                        medicalResultID={resultNew?.data._id}
                    />
                </Modal>
                <CreateMedicines onlyCreate visible={isVisibleCreateMedicines} close={() => setIsVisibleCreateMedicines(false)} medicalResultID={resultNew?.data._id} />
            </div>
        </div>
    );
};

export default MedicalRecord;

const Title = styled.div`
    font-size: 16px;
    font-weight: bold;
    display: inline;
`;


const CUpload = styled(Upload)`
    .ant-tooltip {
        display: none;
    }
`;
