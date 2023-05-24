import { Form, message } from "antd";
import moment from "moment";
import React from "react";
// import { useHistory } from "react-router-dom";
import { axiosAuth } from "../../../config/axios";
import { CInput, DInput, FCenter, CButton } from "../../Profile";
import {useSelector} from "react-redux";

export const CreateRecord = ({ nextStep, setMedicalRecord, initialValues }) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = React.useState(false);
    // const history = useHistory();
    const { username } = useSelector(state => state.user.user)

    const handleSubmit = (values) => {
        setIsLoading(true)
        axiosAuth({
            url: "/medical/add-medical-record",
            method: "post",
            data: {
                ...values,
                auth: values?.auth ? values?.auth : 'Bản thân',
                users: username
            },
        })
            .then((res) => {
                message.success("Tạo thành công");
                nextStep();
                setMedicalRecord(res.data.data);
            })
            .catch((error) => {
                message.error("Có lỗi xảy ra");
                console.log(error);
            });
        setIsLoading(false)
    };


    const handleUpdate = (values) => {
        setIsLoading(true)
        const data = {
            ...initialValues, ...values, birthday: moment(initialValues?.birthday).format("DD/MM/YYYY"),
        };

        axiosAuth({
            url: "/medical/update-medical-record",
            method: "post",
            data,
        })
            .then((res) => {
                // window.location.reload();
                message.success("Cập nhật thành công")
                nextStep();
                setMedicalRecord(res.data.data);
            })
            .catch((error) => console.log(error));
        setIsLoading(false)
    };

    function disabledDate(current) {
        // Can not select days before today and today
        return current && current.valueOf() > moment(initialValues.createAt);
    }

    console.log(initialValues)

    return (
        <FCenter>
            {
                initialValues ?
                    <Form
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        // onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        onFinish={handleUpdate}
                        style={{ marginRight: "50px" }}
                        initialValues={{
                            ...initialValues,
                            birthday: moment(initialValues?.birthday),
                            updateAt: moment(initialValues?.updateAt),
                            createAt: moment(initialValues?.createAt),
                        }}
                        disabled
                    // onSubmitCapture={handleUpdate}
                    >
                        <Form.Item label="Tên bệnh nhân" name="fullName" rules={[{ required: true, message: 'Vui lòng nhập thông tin' }]}>
                            <CInput name="fullName" placeholder="Tên bệnh nhân" />
                        </Form.Item>
                        <Form.Item label="Tên bệnh" name="medicalName" rules={[{ required: true, message: 'Vui lòng nhập thông tin' }]}>
                            <CInput name="medicalName" placeholder="Tên bệnh" />
                        </Form.Item>
                        <Form.Item label="Ngày sinh" name="birthday" >
                            <DInput name="birthday" placeholder="Ngày sinh" />
                        </Form.Item>
                        <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: 'Vui lòng nhập thông tin' }, {
                            message: "Vui lòng nhập đúng Số điện thoại",
                            pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g
                        }]}>
                            <CInput name="phone" placeholder="Số điện thoại" />
                        </Form.Item>
                        <Form.Item label="Địa chỉ" name="address" rules={[{ required: true, message: 'Vui lòng nhập thông tin' }]}>
                            <CInput name="address" placeholder="Địa chỉ" />
                        </Form.Item>
                    </Form>
                    :
                    <Form
                        form={form}
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        autoComplete="off"
                        style={{ marginRight: "50px" }}
                        onFinish={handleSubmit}
                        initialValues={{
                            startDate: moment(),
                        }}
                    >
                        <Form.Item label="Tên bệnh nhân" name="fullName" rules={[{ required: true, message: 'Vui lòng nhập thông tin' }]}>
                            <CInput name="fullName" placeholder="Tên bệnh nhân" />
                        </Form.Item>
                        <Form.Item label="Tên bệnh" name="medicalName" rules={[{ required: true, message: 'Vui lòng nhập thông tin' }]}>
                            <CInput name="medicalName" placeholder="Tên bệnh" />
                        </Form.Item>
                        <Form.Item label="Ngày sinh" name="birthday" rules={[{ required: true, message: 'Vui lòng nhập thông tin' }]}>
                            <DInput name="birthday" placeholder="Ngày sinh" format="DD/MM/YYYY" />
                        </Form.Item>
                        <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: 'Vui lòng nhập thông tin' }]}>
                            <CInput name="phone" placeholder="Số điện thoại" />
                        </Form.Item>
                        <Form.Item label="Địa chỉ" name="address" rules={[{ required: true, message: 'Vui lòng nhập thông tin' }]}>
                            <CInput name="address" placeholder="Địa chỉ" />
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <CButton CButton type="primary" htmlType="submit" loading={isLoading}>
                                Tạo bệnh án</CButton>
                        </Form.Item>
                    </Form>
            }
        </FCenter >
    );
};
