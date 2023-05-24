import React, { useEffect } from "react";
import styled from "styled-components";
import { Form, Input, message } from "antd";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, SignInUser } from "../redux/slices/UserSlice";
import { CButton, CInput } from "./Profile";

export const Logout = () => {
    const dispatch = useDispatch()
    dispatch(logout())
    return <></>
}


export default function Login() {
    const dispatch = useDispatch();
    const {
        isLoading,
        isSuccess,
        isError,
        message: messages,
        user
    } = useSelector((state) => state.user);
    const history = useHistory();

    const onFinish = (values) => {
        console.log("Success:", values);

        dispatch(SignInUser(values));
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    useEffect(() => {
        if (isSuccess) {
            if (user.role === 'admin') {
                history.push("/management");
            } else {
                history.push("/");
            }
            message.success(messages);
        }
        if (isError) {
            message.error("Sai tài khoản hoặc mật khẩu");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, isSuccess, isError, message]);

    return (
        <WrapperLogin>
            <FormLogin>
                <Header>
                    <img
                        width="120"
                        height="120"
                        src="https://cdn-icons-png.flaticon.com/512/4200/4200528.png"
                        alt="avt"
                    />
                    <h2>Đăng Nhập</h2>
                </Header>
                <Content>
                    <Form
                        name="basic"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        layout="vertical"
                        style={{ width: "80%" }}
                        size="large"
                    >
                        <Form.Item
                            label="Username"
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập username",
                                },
                                {
                                    min: 5,
                                    message: 'Username ít nhất 5 kí tự'
                                }
                            ]}
                        >
                            <CInput />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập mật khẩu!",
                                },
                                {
                                    min: 3,
                                    message: 'Mật khẩu ít nhất 6 kí tự'
                                }
                            ]}
                        >
                            <PInput />
                        </Form.Item>
                        {/*
            <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
              <Checkbox>Remember me</Checkbox>
            </Form.Item> */}

                        <Form.Item>
                            <CButton
                                type="primary"
                                htmlType="submit"
                                style={{ width: "100%" }}
                                loading={isLoading}
                            >
                                Đăng Nhập
                            </CButton>
                        </Form.Item>
                    </Form>
                </Content>
                {/* <FooterLogin>
                    <span>Hoặc đăng ký</span>
                    <Link to="/register" className="main-color"> tại đây</Link>
                </FooterLogin> */}
            </FormLogin>
        </WrapperLogin>
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
    height: 600px;
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
    height: 100px;
    line-height: 100px;
    font-size: 16px;
    text-align: center;
`;

export const PInput = styled(Input.Password)`
    height: ${(p) => p.height || "100%"};
    width: ${(p) => p.width || "100%"};
    padding: 10px 10px 10px 20px;
    font-size: 1rem;
    border-radius: var(--border-radius);
    color: var(--txt-color);
    background-color: var(--main-bg);
    box-shadow: var(--box-shadow);
    border: 2px solid transparent;
`;
