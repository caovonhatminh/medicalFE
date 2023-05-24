import { Form, message } from "antd";
import { useState } from "react";
import { CButton, CInput, FCenter } from "../../Profile";

import { axiosAuth } from "../../../config/axios";

export const CreateMedicalExamination = ({ medicalResultID, nextStep, isModal }) => {
    const [form] = Form.useForm();
    const [image, setImage] = useState(null);

    const handleCreateResult = (values) => {
        const formData = new FormData();


        for (let [key, value] of Object.entries(values)) {

            switch (key) {
                case "image": {
                    formData.append("image", image, image?.name);
                    break;
                }
                default:
                    formData.append(key, value);
            }
        }
        formData.append("medicalResultID", medicalResultID);

        axiosAuth({
            url: "/medical/add-medical-examination-content",
            method: "post",
            data: formData,
        })
            .then((res) => {
                message.success("Tạo thành công");
                // history.push("/medicals");
                if (isModal) {
                    nextStep()
                } else {
                    window.location.href = "/medicals"
                }
            })
            .catch((error) => {
                console.log(error);
                message.error("Có lỗi xảy ra");
            });
    };

    return (
        <FCenter>
            <Form
                form={form}
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                // onFinishFailed={handleCreateResult}
                autoComplete="off"
                style={{ marginRight: "50px" }}
                // onSubmitCapture={handleCreateResult}
                onFinish={handleCreateResult}
            >
                <Form.Item label="Tên khám" name="name" rules={[{ required: true, message: 'Vui lòng nhập thông tin' }]}>
                    <CInput  placeHolder="Tên lần khám khác" />
                </Form.Item>
                <Form.Item label="Kết quả khám" name="result" rules={[{ required: true, message: 'Vui lòng nhập thông tin' }]}>
                    <CInput  placeHolder="Kết quả khám" />
                </Form.Item>
                <Form.Item label="Hình ảnh" name="image" rules={[{ required: true, message: 'Vui chọn hình ảnh' }]}>
                    <CInput
                        accept="image/png, image/gif, image/jpeg"
                        type="file"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <CButton type="primary" htmlType="submit">
                        Lưu
                    </CButton>
                </Form.Item>
            </Form>
        </FCenter>
    );
};
