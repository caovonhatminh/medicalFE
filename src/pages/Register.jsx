import React, { useEffect } from "react";
import styled from "styled-components";
import { Form, message, Modal, Radio } from "antd";
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SignUpUser } from "../redux/slices/UserSlice";
import { useSelector } from "react-redux";
import { CButton, CInput } from "./Profile";
import { Logout, PInput } from "./Login";
import { axiosNotAuth } from "../config/axios";

export default function Register({ isVisible, setIsVisible }) {
    const dispatch = useDispatch();
    // const {
    //     isLoading,
    //     isSuccess,
    //     isError,
    //     message: messages,
    // } = useSelector((state) => state.user);
    const history = useHistory();

    const onFinish = async (values) => {
        delete values.confirm;
        console.log("Success:", values);

        try {
            const dataUser = {
                ...values,
                password: '123456'
            }
            const { data } = await axiosNotAuth.post(`/user/register`, dataUser);
            if (data?.data === 'success') {
                message.success('Tạo tài khoản thành công')
                setIsVisible(false)
            } else {
                if (data.msg == 'user is existed') {
                    message.error('Tài khoản đã tồn tại', 1)

                } else
                    message.error('Tạo tài khoản thất bại', 1)
            }
            return data;
        } catch (error) {
            console.log(error);
            if (error?.response?.data.msg == 'user is existed') {
                message.error('Tài khoản đã tồn tại', 1)
            } else
                message.error('Tạo tài khoản thất bại', 1)
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };
    // useEffect(() => {
    //     if (isSuccess) {
    //         history.push("/login");
    //         dispatch(Logout())
    //         message.success(messages);
    //     }
    //     if (isError) {
    //         message.error(messages);
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [isLoading, isSuccess, isError, message]);

    return (
        // <WrapperLogin>
        <Modal
            open={isVisible}
            onCancel={() => setIsVisible(false)}
            centered
            footer={null}
            destroyOnClose
        >
            {/* <FormLogin> */}
            <Header>
                <img
                    width="80"
                    height="80"
                    src="https://cdn-icons-png.flaticon.com/512/4200/4200528.png"
                    alt="avt"
                />
                <h2>Tạo tài khoản</h2>
            </Header>
            <Content>
                <Form
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    // layout="vertical"
                    style={{ width: "80%" }}
                    size="large"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập username!",
                            },
                            {
                                min: 5,
                                message: 'Ít nhất 5 kí tự'
                            },
                        ]}
                    >
                        <CInput />
                    </Form.Item>

                    {/* <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            {
                                required: true,
                                message: "Please input your password!",
                            },
                            {
                                min: 6,
                                message: 'Mật khẩu ít nhất 6 kí tự'
                            }
                        ]}
                        hasFeedback
                    >
                        <PInput />
                    </Form.Item> */}
                    {/*
            <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
              <Checkbox>Remember me</Checkbox>
            </Form.Item> */}

                    {/* <Form.Item
                        name="confirm"
                        label="Confirm"
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
                    </Form.Item> */}
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
                        wrapperCol={{ span: 16, offset: 8 }}>
                        <CButton
                            type="primary"
                            htmlType="submit"
                            style={{ width: "100%" }}

                        >
                            Tạo ngay
                        </CButton>
                    </Form.Item>
                </Form>
            </Content>
            {/* <FooterLogin>
                <span>Hoặc đăng nhập</span>
                <Link to="/login" className="main-color">
                    {" "}
                    tại đây
                </Link>
            </FooterLogin> */}
            {/* </FormLogin> */}
        </Modal >
        // </WrapperLogin >
    );
}

const WrapperLogin = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f1f1f1;
`;

const FormLogin = styled.div`
    width: 500px;
    min-height: 600px;
    background-color: #ffffff;
    border: 1px solid #aaaaaa;
    box-shadow: 0px 3px 13px 0 #adadadb9;
    border-radius: 6px;
`;

const Header = styled.div`
    height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    h2 {
        color: #1890ff;
        font-size: 30px;
    }
`;
const Content = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;

    .ant-form-large .ant-form-item-label > label {
        font-size: 18px;
        color: #1890ff;
    }
`;
const FooterLogin = styled.div`
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    text-align: center;
`;
