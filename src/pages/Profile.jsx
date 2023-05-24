import { useEffect, useState } from "react";
import { axiosAuth } from "../config/axios";
import moment from "moment";
import {Button, Col, DatePicker, Form, Input, message, Radio} from "antd";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { URL_AVATAR } from "../constants";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const Profile = () => {
    const [form] = Form.useForm();
    const user = useSelector((state) => state.user.user);
    const [isLoading, setIsLoading] = useState(false);

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };
    const [avatar, setAvatar] = useState(null);


    const handleUpdate = (values) => {
        setIsLoading(true)
        const formData = new FormData();
        const temp = {
            ...user,
            ...values,
        }
        for (let [key, value] of Object.entries(temp)) {
            if (key === "avatar" && avatar) {
                formData.append("avatar", avatar, avatar?.name);
            } else if (key === "birthday") {
                formData.append("birthday", value.format('DD/MM/YYYY'));
            }
            else {
                formData.append(key, value);
            }
        }

        axiosAuth({
            url: "/user/update",
            method: "post",
            data: formData,
        })
            .then(() => {
                message.success("Cập nhật thành công");
                window.location.href = "/";
            })
            .catch((error) => {
                console.log(error);
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

    useEffect(() => {
        if (user?.avatar) {
            setImageUrl(`${URL_AVATAR}/${user.avatar}`);
        }
        form.setFieldValue("fullName", user.fullName);
        form.setFieldValue("address", user.address);
        form.setFieldValue("birthday", user?.birthday ? moment(user?.birthday) : moment());
        form.setFieldValue("phone", user.phone);
        form.setFieldValue("role", user.role);
        form.setFieldValue("username", user.username);
    }, [form, user]);

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
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 16 }}
                                    onFinishFailed={onFinishFailed}
                                    autoComplete="off"
                                    onFinish={handleUpdate}
                                // onSubmitCapture={handleUpdate}
                                >
                                    <Col span={16} offset={8}>
                                        <label
                                            htmlFor="avatar"
                                            style={{
                                                cursor: "pointer",
                                                margin: "0 auto",
                                                display: "flex",
                                                justifyContent: "center",
                                                marginBottom: "10px",
                                            }}
                                        >
                                            <img
                                                src={
                                                    avatar
                                                        ? URL.createObjectURL(
                                                            avatar
                                                        )
                                                        : imageUrl ||
                                                        "avatar-default-icon.png"
                                                }
                                                alt="avatar"
                                                style={{
                                                    width: "100px",
                                                    height: "100px",
                                                    objectFit: "cover",
                                                    borderRadius: "50%",
                                                }}
                                            />
                                        </label></Col>
                                    <Form.Item
                                        label="Ảnh đại diện"
                                        name="avatar"
                                    >
                                        <CInput
                                            type="file"
                                            id="avatar"
                                            name="avatar"
                                            onChange={handleChange}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label="Username"
                                        name="username"
                                    >
                                        <CInput name="fullName" disabled placeholder="username" />
                                    </Form.Item>
                                    <Form.Item
                                        label="Tên hiển thị"
                                        name="fullName"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Vui lòng nhập tên",
                                            },
                                        ]}
                                    >
                                        <CInput name="fullName" placeholder="Tên hiển thị" />
                                    </Form.Item>
                                    <Form.Item
                                        label="Ngày sinh"
                                        name="birthday"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Vui lòng nhập ngày sinh",
                                            },
                                        ]}
                                    >
                                        <DInput
                                            type="date"
                                            name="birthday"
                                            format="DD/MM/YYYY"
                                            placeholder="Ngày sinh"
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label="Số điện thoại"
                                        name="phone"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Vui lòng nhập số điện thoại",
                                            },
                                            {
                                            message: "Vui lòng nhập đúng số điện thoại",
                                            pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g
                                        }]}
                                    >
                                        <CInput name="phone" placeholder="Số điện thoại" />
                                    </Form.Item>
                                    <Form.Item label="Địa chỉ" name="address" rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng nhập địa chỉ",
                                        },
                                    ]}>
                                        <CInput name="address" placeholder="Địa chỉ" />
                                    </Form.Item>
                                    {/* <Form.Item
                                        label="Chức vụ"
                                        name="role"
                                        initialValue="bs"
                                    >
                                        <Radio.Group>
                                            <Radio value="bs">Bác sĩ</Radio>
                                            <Radio value="yt">Y tá</Radio>
                                        </Radio.Group>
                                    </Form.Item> */}
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
                        <div style={{ textAlign: 'end', borderTop: '1px solid #dcd4d4', paddingTop: 10 }}>
                            <Link
                                to="/update-pass"
                                className=""
                            >
                                Cập nhật mật khẩu
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

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
    }

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
