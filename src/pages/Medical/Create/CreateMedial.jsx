import { Button, message, Modal, Steps } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import { CreateRecord } from "./CreateMedicalRecord";
import { CreateRecordResult } from "./CreateMedicalResult";
import { CreateMedicalExamination } from "./CreateMedicalExamination";
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import {useDispatch, useSelector} from "react-redux";
import {GetAppointment} from "../../../redux/slices/AppointmentSlice";
const { Step } = Steps;

const CreateMedial = () => {
    const [current, setCurrent] = useState(0);
    const [medicalRecord, setMedicalRecord] = useState(null);
    const [medicalResultID, setMedicalResultID] = useState(null);
    const history = useHistory()
    const [visible, setVisible] = useState(false)


    const closeModal = () => {
        setVisible(false)
    }

    const handleSkip = () => {
        history.push("/medicals")
    }

    const next = (res) => {
        if (current === 1) {
            if (res?.data?._id) {
                setCurrent(2);
            } else {
                message.error('Vui lòng nhập thông tin')
            }
        }
        if (current === 0) {
            setCurrent(current + 1);
        }
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const steps = [
        {
            title: "Tổng quát",
            content: (
                <CreateRecord
                    nextStep={next}
                    setMedicalRecord={setMedicalRecord}
                    initialValues={medicalRecord}
                />
            ),
        },
        {
            title: "Chi tiết",
            content: (
                <CreateRecordResult
                    nextStep={next}
                    medicalRecordID={medicalRecord?._id}
                    setMedicalResultID={setMedicalResultID}
/>
            ),
        },
        {
            title: "Hoàn thành",
            content: (
                <CreateMedicalExamination medicalResultID={medicalResultID} />
            ),
        },
    ];

    return (
        <div className="row">
            <div className="col-12">
                <div className="card" style={{ padding: "30px 100px" }}>
                    <div className="card__body">
                        <Steps current={current}>
                            {steps.map((item) => (
                                <Step
                                    key={item.title}
                                    title={
                                        <h5 className="layout">{item.title}</h5>
                                    }
                                />
                            ))}
                        </Steps>
                        <WrapperContent className="steps-content">
                            {steps[current].content}
                        </WrapperContent>
                        <WrapperFooter>
                            {/*{current > 0 && (*/}
                            {/*    <Button*/}
                            {/*        style={{*/}
                            {/*            margin: "0 8px",*/}
                            {/*        }}*/}
                            {/*        onClick={() => prev()}*/}
                            {/*    >*/}
                            {/*        Quay lại*/}
                            {/*    </Button>*/}
                            {/*)}*/}
                            {/* {current === steps.length - 1 && (
                                <Button type="primary" onClick={() => message.success('Processing complete!')}>
                                    Done
                                </Button>
                            )}    */}
                            {current < steps.length - 1 &&
                                medicalRecord?._id && (
                                    <Button
                                        type="primary"
                                        onClick={() => next()}
                                    >
                                        Bước tiếp theo
                                    </Button>
                                )}{" "}
                            {
                                current >= 1 && <Button
                                    type="dashed"
                                    style={{
                                        marginLeft: '15px',
                                    }}
                                    onClick={() => setVisible(true)}
                                >
                                    Bỏ qua tất cả
                                </Button>
                            }
                        </WrapperFooter>
                    </div>
                </div>
                <Modal
                    destroyOnClose
                    centered
                    title="Xác nhận"
                    open={visible}
                    onCancel={closeModal}
                    onOk={handleSkip}
                    okText="Xác nhận"
                    cancelText="Huỷ"

                >
                    Xác nhận bỏ qua
                </Modal>
            </div>
        </div >
    );
};

export default CreateMedial;

const WrapperContent = styled.div`
    margin-top: 30px;
    padding: 20px;
`;

const WrapperFooter = styled.div`
    display: flex;
    justify-content: flex-end;
`;
