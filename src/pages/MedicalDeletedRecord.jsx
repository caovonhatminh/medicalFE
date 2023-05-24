import { Modal, Skeleton, Tooltip } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Table from "../components/table/Table";
import { axiosAuth } from "../config/axios";
import { EyeOutlined } from "@ant-design/icons";
import { Space } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper";
import styled from "styled-components";
import Viewer from "react-viewer";
import { getLinkImage } from "../constants";


const renderCusomerHead = (item, index) => (
    <th key={index} style={{ textAlign: "center" }}>
        {item}
    </th>
);

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
        <tr key={index}>
            <th>{item.stt}</th>
            <td>{moment(item.date).format("DD/MM/YYYY")}</td>
            <td width={200} style={{ textAlign: "center" }}>
                <img
                    width={80}
                    height={100}
                    style={{ objectFit: "cover" }}
                    src={getLinkImage(item.medicineImage)}
                    alt="thuoc"
                    onClick={() =>
                        handleSetListImage([{ src: getLinkImage(item.medicineImage) }])
                    }
                />
            </td>
            <td style={{ textAlign: "center" }}>{item.finalResult}</td>
            <td width={200} style={{ textAlign: "center" }}>
                <Space size="middle">
                    <Tooltip title="Số mục khám">
                        ({item.results.length})
                    </Tooltip>
                    {item.results.length ? <Tooltip title="Xem chi tiết">
                        <EyeOutlined
                            onClick={() => showModal({ data: item.results, type: 0 })}
                            width={100}
                        />
                    </Tooltip> : <></>
                    }
                </Space>
            </td>
            <td width={200} style={{ textAlign: "center" }}>
                <Space size="middle">
                    <Tooltip title="Số toa">
                        ({item.medicines.length})
                    </Tooltip>
                    {
                        item.medicines.length > 0 ? <Tooltip title="Xem chi tiết">
                            <EyeOutlined
                                onClick={() => showModal({ data: item.medicines, type: 1 })}
                                width={100}
                            />

                        </Tooltip> : <></>
                    }
                </Space>
            </td>
        </tr>
    );
};

const MedicalDeletedRecord = () => {
    const { id } = useParams();
    const [medicalRecord, setMedicalRecord] = useState(null);
    const [medicalRecordResult, setMedicalRecordResult] = useState([]);
    const [dataModal, setDataModal] = useState();
    const [isOpenImage, setIsOpenImage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const history = useHistory();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [listImage, setListImage] = useState([]);
    const [modalVisible, setModalVisible] = useState(false)
    const [isVisibleCreateExam, setIsVisibleCreateExam] = useState(false)

    const openModal = (item) => {
        setModalVisible(true);
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

    const openShowCreateExam = (data) => {
        setIsVisibleCreateExam(true)
    }

    const openShowCreateMedicines = (data) => {
    }

    useEffect(() => {
        if (!medicalRecordResult.length) {
            setIsLoading(true)
        }
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

                data.data = data.data.sort((a, b) => new moment(b.date).format('YYYYMMDD') - new moment(a.date).format('YYYYMMDD'))

                setMedicalRecordResult(data.data);
                setIsLoading(false)
            })
            .catch((e) => {
                console.log(e);
                setIsLoading(false)
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, isVisibleCreateExam, modalVisible]);

    const handleSetListImage = (list) => {
        setListImage(list);
        setIsOpenImage(true);
    };

    return (
        <div>
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
                            <TitleDel>Bệnh án đã xoá</TitleDel>
                            <div className="col-12">
                                <Title>Chi tiết bệnh án</Title>
                            </div>
                        </div>
                        <div className="card__body">
                            {isLoading ? <Skeleton active /> : medicalRecord && (
                                <Space direction="vertical">
                                    <div className="col-12 inline">
                                        <Title>Tên bệnh:</Title>{" "}
                                        <strong>
                                            {medicalRecord.medicalName}
                                        </strong>
                                    </div>
                                    <div className="col-12">
                                        <Title>Bệnh viện:</Title>{" "}
                                        <strong>
                                            {medicalRecord.hospitalName}
                                        </strong>
                                    </div>
                                    <div className="col-12">
                                        <Title>Ngày tạo:</Title>{" "}
                                        <strong>
                                            {moment(
                                                medicalRecord.createAt
                                            ).format("DD/MM/YYYY")}
                                        </strong>
                                    </div>
                                    <div className="col-12">
                                        <Title>Cập nhật ngày:</Title>{" "}
                                        <strong>
                                            {moment(
                                                medicalRecord.updateAt
                                            ).format("DD/MM/YYYY")}
                                        </strong>
                                    </div>
                                    <div className="col-12">
                                        <Title> Số lần khám:</Title>{" "}
                                        <strong>
                                            {
                                                medicalRecord.medicalResults
                                                    ?.length
                                            }
                                        </strong>
                                    </div>
                                </Space>
                            )}
                            <div style={{ height: "50px", textAlign: 'end' }}>

                            </div>
                            {isLoading ?
                                <Skeleton /> :
                                <Table
                                    limit="10"
                                    headData={[
                                        "#",
                                        "Ngày khám",
                                        "Hình ảnh",
                                        "Chuẩn đoán",
                                        "Khám khác",
                                        "Toa thuốc",
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
                                />}
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
                                                    return { src: getLinkImage(x.image) };
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
                                        <h3>Số lượng: {item.quantity}</h3>
                                        <p>
                                            Cách uống:{" "}
                                            <strong>
                                                {item.isAfter
                                                    ? "Sau khi ăn"
                                                    : "Trước khi ăn"}
                                            </strong>
                                        </p>
                                        <p>
                                            Sáng:{" "}
                                            <strong>
                                                {item.morning}
                                            </strong>
                                        </p>
                                        <p>
                                            Trưa:{" "}
                                            <strong>
                                                {item.afternoon}
                                            </strong>
                                        </p>
                                        <p>
                                            Tối:{" "}
                                            <strong>
                                                {item.night}
                                            </strong>
                                        </p>
                                    </div>
                                </SwiperSlide>
                            ))}
                    </Swiper>
                </Modal>
            </div>
        </div>
    );
};

export default MedicalDeletedRecord;
const TitleDel = styled.div`
    font-size: 18px;
    font-weight: bold;
    display: block;
    color: #a1a1a1;
    margin-bottom: 20px;
`;


const Title = styled.div`
    font-size: 16px;
    font-weight: bold;
    display: inline;
`;