import { Select, Radio, Space } from 'antd';
import { Button, Form, Input } from 'antd';
import { Card } from 'antd';
import React, { useEffect, useState } from 'react';
import NavBar from "../../components/NavBar/NavBar"
import { getStudentClassroom, createStudentAssessments } from '../../Utils/requests';

//Form to take the assessment
function TakeAssess() {
    //Use local storage to get the assessment data
    const data = JSON.parse(localStorage.getItem('my-assessment'));
    const [answers, setAnswers] = useState(new Array(data["questions"].length).fill(false));

    //Function that ensures that all questions are answered before submitting
    //If the student has not answered a question, an alert will pop up
    //Else the function getStudentClassroom is used to put the answers in the StudentAssessment table
    async function SubmitAssessment() {
        for (let i = 0; i < answers.length; i++) {
            if (answers[i] === false) {
                alert("You must enter an answer for question " + (i + 1));
                return;
            }
        }
        let res = await getStudentClassroom();
        const classID = res.data.classroom.id;
        let id = JSON.parse(localStorage.getItem("studentsID"))[0];
        console.log(classID);
        createStudentAssessments(data["name"], id, classID, answers);
    }

    //Onchange of the answer choices or text box store the new answer in the index
    function onChange(index, e) {
        let temp = [...answers];
        temp[index] = e.target.value;
        setAnswers(temp);
        console.log(answers);
    }


    //It will iterate through each question to display the question and answer choices
    return (
        <div className="container nav-padding">
            <NavBar />
            <Card title={<h1 style={{ fontSize: '28px' }}>{data["name"]}</h1>} style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h2>Description: {data["description"]}</h2>
                <Space direction="vertical" size={32}>
                    {data["questions"].map((question, index) => (
                        <div key={index}>
                            {question.type === "Multiple Choice" ? (
                                <Card title={`Question ${index + 1}. ${question.question}`} style={{ width: '100%' }}>
                                    <Radio.Group onChange={(e) => onChange(index, e)}>
                                        <Space direction="vertical">
                                            {question.option.map((option, optionIndex) => (
                                                <Radio value={optionIndex} key={optionIndex}>{option}</Radio>
                                            ))}
                                        </Space>
                                    </Radio.Group>
                                </Card>
                            ) : (
                                <Card title={`Question ${index + 1}. ${question.question}`} style={{ width: '100%' }}>
                                    <Form id="activity-detail-editor" layout="horizontal" size="default" labelCol={{
                                        span: 6,
                                    }}
                                        wrapperCol={{
                                            span: 14,
                                        }}>
                                        <Form.Item labelAlign='left' onChange={(e) => onChange(index, e)}>
                                            <Input.TextArea />
                                        </Form.Item>
                                    </Form>
                                </Card>
                            )}
                        </div>
                    ))}
                </Space>
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Button id="submit" onClick={SubmitAssessment}>Submit Assessment</Button>
                </div>
            </Card>
        </div>
    )
}

export default TakeAssess;
