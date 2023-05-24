import { useEffect, useState } from "react";
import { axiosAuth } from "../config/axios";
import moment from "moment";
import { Button, Col, DatePicker, Form, Input, message, Radio } from "antd";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { URL_AVATAR } from "../constants";
import { PInput } from "./Login";
import { Link, useHistory } from "react-router-dom";

const UpdatePassword = () => {
    const [form] = Form.useForm();
    const user = useSelector((state) => state.user.user);
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory()
    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };
    const [avatar, setAvatar] = useState(null);


    const handleUpdate = (values) => {
        setIsLoading(true)
        axiosAuth({
            url: "/user/update-pass",
            method: "post",
            data: {
                _id: user?._id,
                ...values
            },
        })
            .then(({ data }) => {
                console.log(data.data);
                // window.location.href = "/logout";
                if (data.data.code == 400) {
                    message.error(data.data.msg)
                } else {
                    message.success("Cập nhật thành công");
                    history.push("/profile");
                }
            })
            .catch((error) => {
                console.log(error);
                message.error("Cập nhật thất bại");
            });
        setIsLoading(false)
    };
    const [imageUrl, setImageUrl] = useState();

    const handleChange = (e) => {
        const fileList = e.target.files;
        if (!fileList) return;
        setAvatar((prev) => {
            return fileList[0];
        });
    };

    return (
        <div>
            <h2 className="page-header layout">Thông tin cá nhân</h2>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card__body">
                            <FCenter>
                                <Form
                                    form={form}
                                    name="basic"
                                    labelCol={{ span: 9 }}
                                    wrapperCol={{ span: 15 }}
                                    onFinishFailed={onFinishFailed}
                                    autoComplete="off"
                                    onFinish={handleUpdate}
                                // onSubmitCapture={handleUpdate}
                                >
                                    <Form.Item
                                        name="oldPassword"
                                        label="Mật khẩu cũ"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Vui lòng nhập mật khẩu!",
                                            }
                                        ]}
                                    >
                                        <PInput />
                                    </Form.Item>
                                    <Form.Item
                                        name="password"
                                        label="Mật khẩu mới"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Vui lòng nhập mật khẩu!",
                                            },
                                            {
                                                min: 6,
                                                message: 'Mật khẩu ít nhất 6 kí tự'
                                            }
                                        ]}
                                        hasFeedback
                                    >
                                        <PInput />
                                    </Form.Item>
                                    <Form.Item
                                        name="confirm"
                                        label="Xác nhận mật khẩu"
                                        dependencies={["password"]}
                                        hasFeedback
                                        rules={[
                                            {
                                                required: true,
                                                message: "Vui lòng nhập mật khẩu",
                                            },
                                            {
                                                min: 6,
                                                message: 'Mật khẩu ít nhất 6 kí tự'
                                            },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (
                                                        !value ||
                                                        getFieldValue("password") === value
                                                    ) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(
                                                        new Error(
                                                            "Chưa khớp!"
                                                        )
                                                    );
                                                },
                                            }),
                                        ]}
                                    >
                                        <PInput />
                                    </Form.Item>
                                    <Form.Item
                                        wrapperCol={{ offset: 8, span: 16 }}
                                    >
                                        <CButton
                                            type="primary"
                                            htmlType="submit"
                                            loading={isLoading}
                                        >
                                            Cập nhật
                                        </CButton>
                                    </Form.Item>
                                </Form>
                            </FCenter>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdatePassword;

export const CInput = styled(Input)`
    height: ${(p) => p.height || "100%"};
    width: ${(p) => p.width || "100%"};
    padding: 10px 10px 10px 20px;
    font-size: 1rem;
    border-radius: var(--border-radius);
    color: var(--txt-color);
    background-color: var(--main-bg);
    box-shadow: var(--box-shadow);
    border: 2px solid transparent;
    
    &:hover {
        border: 2px solid var(--main-color);;
    }
`;

export const DInput = styled(DatePicker)`
    height: 100%;
    width: ${(p) => p.width || "100%"};
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
    }import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

`;

export const FCenter = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const CButton = styled(Button)`
    width: ${(p) => p.width || "100%"};
    border-radius: var(--border-radius);
    color: var(--txt-white);
    background-color: var(--main-color);
    box-shadow: var(--box-shadow);
    text-align: center;
    height: 40px;

    :hover {
     background-color: var(--second-color);
     color: var(--txt-white);
    }
`;
