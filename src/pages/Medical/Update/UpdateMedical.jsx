import { Form, message, Modal } from "antd";
import moment from "moment";
import {useDispatch, useSelector} from "react-redux";
import { axiosAuth } from "../../../config/axios";
import { GetMedicals } from "../../../redux/slices/MedicalSlice";
import { useState } from 'react';
import { CButton, CInput, DInput } from "../../Profile";

export default function UpdateMedical({ visible, closeModal, oldData }) {
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useSelector((state) => state.user);

    const handleUpdate = (values) => {
        setIsLoading(true)
        const data = {
            _id: oldData._id,
            ...values,
            birthday: values?.birthday ? moment(values?.birthday).format("DD/MM/YYYY") : '',
            createAt: moment(values?.createAt).format("DD/MM/YYYY")
        };

        axiosAuth({
            url: "/medical/update-medical-record",
            method: "post",
            data,
        })
            .then((response) => {
                // window.location.reload();
                dispatch(GetMedicals(user))
                closeModal()
                message.success("Cập nhật thành công")
            })
            .catch((error) => console.log(error));
        setIsLoading(false)
    };

    function disabledDate(current) {
        // Can not select days before today and today
        return current && current.valueOf() > moment(oldData.birthday);
    }

    return (
        <Modal
            destroyOnClose
            centered
            title="Cập nhật bệnh án"
            open={visible}
            onCancel={closeModal}
            footer={null}
        >
            <Form
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                // onFinishFailed={onFinishFailed}
                autoComplete="off"
                onFinish={handleUpdate}
                style={{ marginRight: "50px" }}
                initialValues={{
                    ...oldData,
                    createAt: moment(oldData?.createAt),
                    birthday: oldData?.birthday ? moment(oldData?.birthday) : '',
                }}
            // onSubmitCapture={handleUpdate}
            >
                <Form.Item label="Tên bệnh nhân" name="fullName" rules={[{ required: true, message: 'Vui lòng nhập thông tin' }]}>
                    <CInput name="fullName" placeholder="Tên bệnh nhân" />
                </Form.Item>
                <Form.Item label="Tên bệnh" name="medicalName" rules={[{ required: true, message: 'Vui lòng nhập thông tin' }]}>
                    <CInput name="medicalName" placeholder="Tên bệnh" format="DD/MM/YYYY" />
                </Form.Item>
                <Form.Item label="Ngày sinh" name="birthday">
                    <DInput name="birthday" placeholder="Ngày sinh" format="DD/MM/YYYY" />
                </Form.Item>
                <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: 'Vui lòng nhập thông tin' }]}>
                    <CInput name="phone" placeholder="Số điện thoại" />
                </Form.Item>
                <Form.Item label="Địa chỉ" name="address" rules={[{ required: true, message: 'Vui lòng nhập thông tin' }]}>
                    <CInput name="address" placeholder="Địa chỉ" />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <CButton type="primary" htmlType="submit" loading={isLoading}>
                        Cập nhật
                    </CButton>
                </Form.Item>
            </Form>
        </Modal>
    )
}
