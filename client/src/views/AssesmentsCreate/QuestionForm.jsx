import React, { useState } from 'react';
import { Button,Form, Input } from 'antd';
import './CreateStyle.css';
import { Select,Radio, Space } from 'antd';
import { createAsessment } from '../../Utils/requests';
import { addStudent } from '../../Utils/requests';

function QuestionForm(id) {
  const [questions, setQuestions] = useState([]);
  const [multForm, setMultForm] = useState(false);
  const [frForm, setFrForm] = useState(false);
  const [question, setQuestion] = useState("");
  const [option, setOption] = useState([]);
  const [answer, setAnswer] = useState("");
  const [frAnswer, setfrAnswer] = useState("");
  const [frQuestion, setfrQuestion] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const addOptions = (e) => {
    e.preventDefault();
    setOption([...option, ""]);
  }

  const optionChange = (index, text) => {
    const updatedOption = [...option];
    updatedOption[index] = text;
    setOption(updatedOption);

  }
  const submitMultQuestion = (e) => {
    if(question ==="")
    {
      alert("Please enter a question")
      return;
    }
    else if (option.length === 0)
    {
      alert("Please enter at least one option")
      return;
    }
    else if (answer === ""||answer<1||answer>option.length)
    {
      alert("Please enter a valid answer")
      return;
    }
    
    console.log('clicked')
    setQuestions([...questions, { type: "Multiple Choice", question: question, option: option, answer: answer }]);
    setAnswer("");
    setQuestion("");
    setOption([]);
    resetMultForm();
  }

  const submitFrQuestion = (e) => {
    if(frQuestion ==="")
    {
      alert("Please enter a question")
      return;
    }
    else if (frAnswer === "")
    {
      alert("Please enter an answer")
      return;
    }
    setQuestions([...questions, { type: "Free Response", question: frQuestion, answer: frAnswer }]);
    setfrAnswer("");
    setfrQuestion("");
    setOption([]);
    resetFrForm();
  }

  const resetFrForm = () => {
    console.log("resetting");
    setfrAnswer("");
    setfrQuestion("");
    setFrForm(false);
  }

  const resetMultForm = () => {
    console.log("resetting");
    setAnswer("");
    setQuestion("");
    setMultForm(false);
    setOption([]);
  }

  const  handleChange = (value) => {
    if (value === "Multiple Choice") {
      setMultForm(true);
      setFrForm(false);
    } else {  
      setFrForm(true);
      setMultForm(false);
    }
  }

  const submitAssessment = async (e) => {
    if(name ==="")
    {
      alert("Please enter an assessment name")
      return;
    }
    else if (description === "")
    {
      alert("Please enter an assessment description")
      return;
    }
    let listQ = questions;
    let list1 = [id,name,description]
    let subList = list1.concat(listQ);
    console.log(subList);
    const res = await createAsessment(name, questions);
    console.log(res.data);
    
    //Reset now
    setName("");
    setDescription("");
    setQuestions([]);

  }

  return (
    <div>

      <Form id="activity-detail-editor" layout="horizontal" size="default" labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 14,
        }}>
          <Form.Item label="Assessment Name">
            <Input.TextArea onChange={(e) => setName(e.target.value)} value={name} required placeholder="Enter name of Assignment"/>
          </Form.Item>
          <Form.Item label="Assessment Description">
            <Input.TextArea onChange={(e) => setDescription(e.target.value)} value={description} required placeholder="Enter description of Assignment"/>
          </Form.Item>
          <h2>Create Question:</h2>
          <Select  style={{ width: 200 }} onChange={handleChange} options={[
          { value: 'Multiple Choice', label: 'Multiple Choice' },
          { value: 'Free Response', label: 'Free Response' },
          ]}/>
          {
            multForm && (
              <>
              <Form.Item label="Question">
                <Input.TextArea onChange={(e) => setQuestion(e.target.value)} value={question} required placeholder="Enter question"/>    
              </Form.Item>
              {
                option.length > 0 && (
                  option.map((option, index) => (
                    
                    <>
                    <Form.Item label={ "option "+(index+1)}>
                      <Input.TextArea value={option} onChange={(e) => optionChange(index, e.target.value)} required placeholder="Enter option"/>
                    </Form.Item>
                    </>
                  ))
                
                  )
              }
              {
                option.length >0 && (
                  <>
                    <Form.Item label="Answer Index">
                      <Input.TextArea onChange={(e) => setAnswer(e.target.value)} value={answer} required placeholder="Enter answer index"/>
                    </Form.Item>
                  </>
                )
              }

              </>
            )
          }
          {
            frForm && (
              <>
              <Form.Item label="Question">
                <Input.TextArea onChange={(e) => setfrQuestion(e.target.value)} value={frQuestion} required placeholder="Enter question"/>
              </Form.Item>
              <Form.Item label="Answer">
                <Input.TextArea onChange={(e) => setfrAnswer(e.target.value)} value={frAnswer} required placeholder="Enter answer"/>
              </Form.Item>

              </>
            )

          }
      </Form>
      {
        multForm && (
          <>
              <Button onClick={(e) => addOptions(e)}>Add Option</Button>
              <Button onClick={resetMultForm} >Delete Question</Button>
              <Button onClick={(e) => { submitMultQuestion(e) }}>Submit Question</Button><br />
          </>
        )
      }
      {
        frForm && (
          <>
              <Button onClick={resetFrForm}>Delete Question</Button>
              <Button onClick={(e) => { submitFrQuestion(e) }}>Submit Question</Button><br />
          </>
        )
      }
      <h2>Preview:</h2>
      <ul>
        {questions.map((question, index) => (
          <div key={index}>
            {question.type === "Multiple Choice" ? (
              <div>
                <h4>Question #{index + 1}.{question.question}</h4>
                <Radio.Group>
                  <Space direction="vertical">
                    {question.option.map((option, optionIndex) => (
                      <Radio value={optionIndex}>{option}</Radio>
                    ))}
                  </Space>
                </Radio.Group>
              </div>
            ) : (
              <div>
                <h4>Question #{index + 1}.{question.question}</h4>
                <Form id="activity-detail-editor" layout="horizontal" size="default" labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 14,
        }}>
          <Form.Item labelAlign='left'>
            <Input.TextArea value={question.answer}/>
          </Form.Item>
          </Form>
              </div>
            )}
          </div>
        ))}
      </ul>
    <Button id="submit" onClick={submitAssessment}>Submit Assessment</Button>



    </div>
  );


  
  );


  
}

export default QuestionForm;