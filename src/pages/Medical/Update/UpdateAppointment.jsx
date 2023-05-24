import {Form, message, Modal, Select} from "antd";
import moment from "moment";
import { axiosAuth } from "../../../config/axios";
import {CButton, CInput, DInput} from "../../Profile";
import React from "react";
import {useSelector} from "react-redux";

export function isDuplicateAppointment(dataList, appointmentTime) {
    // YYYY-MM-DD
    const duplicate = dataList.some(data => data.appointment === appointmentTime);
    return duplicate;
}

export default function UpdateAppointment({ visible, closeModal, oldData, dataList }) {
    const [users, setUsers] = React.useState([]);
    const [selected, setSelected] = React.useState([]);

    const handleUpdate = (values) => {

        const newAppointmentTime = moment(values.appointment).format('HH:mm YYYY-MM-DD');
        if (isDuplicateAppointment(dataList, newAppointmentTime)) {
            console.log('Cannot add appointment. Duplicate time already exists.');
            message.error('Đã có lịch hẹn, chọn khung giờ khác!!!')
            return;
        }


        if(!selected || selected?.length == 0) {
            message.error("Vui lòng chọn bác sĩ")
            return;
        }
        // e.preventDefault();
        const data = {
            ...oldData,
            date: moment(oldData.date).format("DD/MM/YYYY"),
            appointment: moment(values.appointment).format("HH:mm DD/MM/YYYY"),
            users: selected.join(',')
        };

        axiosAuth({
            url: "/medical/update-medical-result",
            method: "post",
            data,
        }).then(() => {
            // window.location.reload();
            message.success('Cập nhật thành công')
            closeModal()
        })
            .catch((error) => console.log(error));
    };

    const init = async () => {
        try {
            const response = await axiosAuth({
                url: "/user/get-users",
                method: "get",
            })

            const list = response.data.data.filter(({role})=> role === 'bs').map((item) => ({label: item?.fullName, value: item.username}))
            setUsers(list)
        } catch (error) {
            message.error("Lỗi")
        }
    }
    React.useEffect(() => {
       if(visible) {
           init()
           setSelected(oldData?.users?.split(','))
       }
    }, [visible])

    return (
        <Modal
            destroyOnClose
            centered
            title="Cập nhật lịch hẹn"
            open={visible}
            onCancel={closeModal}
            footer={null}
        >
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                autoComplete="off"
                style={{ marginRight: "50px" }}
                onFinish={handleUpdate}
                initialValues={{
                    appointment: oldData?.appointment ? moment(oldData?.appointment) : "",
                }}
            >
                <Form.Item label="Lịch hẹn" name="appointment" rules={[{ required: true, message: 'Vui lòng chọn lịch hẹn' }]}>
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
                <Form.Item label="Bác sĩ" rules={[{ required: true, message: 'Vui lòng chọn bác sĩ' }]}>
                    <Select
                        value={selected}
                        onChange={setSelected}
                        showSearch
                        mode="tags"
                        maxTagCount="responsive"
                        style={{ width: 250 }}
                        placeholder="Vui lòng chọn bác sĩ"
                        optionFilterProp="children"
                        filterOption={(input, option) => (option?.label ?? '').includes(input)}
                        filterSort={(optionA, optionB) =>
                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                        }
                        options={users}
                    />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <CButton type="primary" htmlType="submit">
                        Cập nhật
                    </CButton>
                </Form.Item>
            </Form>
        </Modal>
    )
}
