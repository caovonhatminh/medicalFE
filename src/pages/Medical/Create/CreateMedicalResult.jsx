import { PlusOutlined } from "@ant-design/icons";
import { Form, message, Tag } from "antd";
import moment from "moment";
import React, { useState } from "react";
import styled from "styled-components";
import { axiosAuth } from "../../../config/axios";
import { CButton, CInput, DInput, FCenter } from "../../Profile";
import CreateMedicines from "./CreateMedicines";
import {isDuplicateAppointment} from "../Update/UpdateAppointment";
import {useDispatch, useSelector} from "react-redux";
import {GetAppointment} from "../../../redux/slices/AppointmentSlice";

export const CreateRecordResult = ({
    nextStep,
    medicalRecordID,
    setMedicalResultID,
    isShowModal = false,
}) => {
    const [form] = Form.useForm();
    const [medicineImage, setMedicineImage] = useState(null);
    const [tags, setTags] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [medicines, setMedicines] = useState([]);
    const { appointment } = useSelector(state => state.appointment)
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch()

    React.useEffect(() => {
        const init = async () =>{
            await dispatch(GetAppointment(user))
        }
        if(user?.username) {
            init()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.username, medicalRecordID])

    const handleCreateResult = (values) => {

        const newAppointmentTime = moment(values.appointment).format('HH:mm YYYY-MM-DD');
        if (isDuplicateAppointment(appointment, newAppointmentTime)) {
            console.log('Cannot add appointment. Duplicate time already exists.');
            message.error('Đã có lịch hẹn, chọn khung giờ khác!!!')
            return;
        }

        const formData = new FormData();
        formData.append("medicalRecordID", medicalRecordID);
        let medicalJSONSTR = JSON.stringify(medicines);
        medicalJSONSTR = medicalJSONSTR.substring(1, medicalJSONSTR.length - 1);

        for (let [key, value] of Object.entries(values)) {
            switch (key) {
                case "medicineImage": {
                    if (medicineImage) formData.append("medicineImage", medicineImage, medicineImage?.name);
                    break;
                }
                case "appointment": {
                    formData.append("appointment", value ?  value.format("HH:mm DD/MM/YYYY") : '');
                    break;
                }
                case "date": {
                    formData.append("date", value.format("DD/MM/YYYY"));
                    break;
                }
                default:
                    formData.append(key, value);
            }
        }
        formData.append("medicines", medicalJSONSTR);

        axiosAuth({
            url: "/medical/add-medical-result",
            method: "post",
            data: formData,
        })
            .then((res) => {
                message.success("Tạo thành công");
                setMedicalResultID(res.data.data?._id);
                nextStep(res.data);
            })
            .catch((error) => {
                message.error("Có lỗi xảy ra");
                console.log(error);
            });
    };

    const handleClose = (removedTag) => {
        const newTags = tags.filter((tag) => tag !== removedTag);
        setMedicines((prev) => prev.filter((e) => newTags.includes(e.name)));
        setTags(newTags);
    };
    const showModal = () => {
        setModalVisible(true);
    };
    const closeModal = (e) => {
        setModalVisible(false);
    };

    const forMap = (tag) => {
        const tagElem = (
            <Tag
                closable
                onClose={(e) => {
                    e.preventDefault();
                    handleClose(tag);
                }}
                color="#55acee"
                siz
            >
                {tag}
            </Tag>
        );
        return (
            <span
                key={tag}
                style={{
                    display: "inline-block",
                }}
            >
                {tagElem}
            </span>
        );
    };

    const tagChild = tags.map(forMap);

    function disabledDate(current) {
        // Can not select days before today and today
        return current && current.valueOf() < Date.now();
    }

    return (
        <FCenter>
            <Form
                form={form}
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                autoComplete="off"
                style={{ marginRight: "50px" }}
                // onSubmitCapture={handleCreateResult}
                onFinish={handleCreateResult}
                initialValues={{
                    date: moment(),
                    // appointment: moment().add(1, "d"),
                    doctor: "",
                    phone: '',

                }}
            >
                <Form.Item
                    label="Ngày khám"
                    name="date"
                    rules={[
                        { required: true, message: "Vui lòng chọn ngày khám" },
                    ]}
                >
                    <DInput type="date" name="date" format="DD/MM/YYYY" />
                </Form.Item>
                <Form.Item label="Lịch hẹn" name="appointment">
                    <DInput
                        format="HH:mm DD/MM/YYYY"
                        showTime
                        minuteStep={30}
                        placeholder="Chọn lịch hẹn"
                        disabledDate={(current) => {
                            return moment().add(0, 'days') >= current
                        }}
                    />
                </Form.Item>
                <Form.Item
                    label="Ảnh đơn thuốc"
                    name="medicineImage"
                >
                    <CInput
                        accept="image/png, image/gif, image/jpeg"
                        type="file"
                        name="medicineImage"
                        onChange={(e) => setMedicineImage(e.target.files[0])}
                    />
                </Form.Item>
                <Form.Item label="Thuốc">
                    <Inline>
                        {tagChild}
                        <Tag
                            onClick={showModal}
                            className="site-tag-plus"
                            color="#55acee"
                        >
                            <PlusOutlined /> Tạo thuốc
                        </Tag>
                    </Inline>
                </Form.Item>
                <Form.Item label="Kết quả khám" name="finalResult" rules={[{ required: true, message: 'Vui lòng nhập kết quả khám' }]}>
                    <CInput
                        name="finalResult"
                        placeholder="Kết quả khám"
                    />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <CButton type="primary" htmlType="submit">
                        Tạo bệnh án
                    </CButton>
                </Form.Item>
            </Form>
            <CreateMedicines
                visible={modalVisible}
                close={closeModal}
                {...{ setTags, tags, medicines, setMedicines }}
            />
        </FCenter>
    );
};

const Inline = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
`;
