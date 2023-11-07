
import { Table, Popconfirm, message } from 'antd';
import {Modal,Button,Switch} from 'antd';
import { useEffect, useState } from 'react';
import { getAssessments, getClassroom } from '../../Utils/requests';
import StudentAssessmenmts from './StudentAssessments';
import './assessmentStyle.css';
import QuestionForm from '../AssesmentsCreate/QuestionForm';
import ViewAssessment from './ViewAssessment';

function Assessments({ classroomId})
{
    const [names,setNames]=useState([]);
    const [assessments,setAssessments]=useState([]);
    const [visible, setVisible] = useState(false);
    const [view,setView] = useState(new Array(getAssessments().then((res)=>res.data.length)).fill(false));

    const viewWork = (i) => {
      let temp = [...view];
      temp[i] = true;
      setView(temp);
      console.log("viewing work");
    }

    const leaveWork = (i) => {
      let temp = [...view];
      temp[i] = false;
      setView(temp);
      console.log("leaving work");
    }

    useEffect(() => {
      getClassroom(classroomId).then((res) => {
        if (res.data) {
          let newNames=[];

          res.data.students.forEach((student) => newNames.push({key: student.id,name:student.name,assessments:"view",grade:"N/A"}));
          setNames([...newNames]);
        } else {
          message.error(res.err);
        }
      });
      //BAD!!! Need to fix how id is stored since righ now it is not using classroom id 
      getAssessments().then((res) => {
        let temp = [];
        console.log(res.data);
        for(let i=0;i<res.data.length;i++){
            if(res.data[i].classroomID==classroomId){
              
              temp.push({
                key:res.data[i].id,
                name:res.data[i].assessmentName,
                description:res.data[i].description,
                open:
                <>
                  <Button type="sucess" onClick={()=>viewWork(i)}>
                    Open
                  </Button>
                  <Modal
                    title={"View Assessment"}
                    visible={view[i]} // Change 'open' to 'visible'
                    onCancel={leaveWork}
                    width={'75vw'}
                    footer={[
                      <Button key="ok" type="primary" onClick={()=>leaveWork(i)}>
                        Cancel
                      </Button>,
                    ]}
                  >
                    <ViewAssessment questions = {res.data[i].questions}/>
                </Modal>
            </>
                ,
                delete:<Popconfirm title="Sure to delete?" onConfirm={() => {
                  message.success('Deleted');
                }}>
                <Button type="primary" danger>
                    Delete
                </Button>
                </Popconfirm>,
                public:<Switch
                />
              
              });
          }
        }
        setAssessments([...temp]);

      });
    }, [classroomId,visible,view]);

    const wsColumn = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          editable: true,
          width: '30%',
          align: 'left',
          sorter: {
            compare: (a, b) => (a.name < b.name ? -1 : 1),
          },
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            editable: true,
            width: '30%',
            align: 'left',
            render: (_, key) => key.description,
          },
          {
            title: 'Open Assigments',
            dataIndex: 'open',
            key: 'open',
            editable: false,
            width: '20%',
            align: 'left',
          },
          {
            title: 'Delete',
            dataIndex: 'delete',
            key: 'delete',
            width: '10%',
            align: 'left',
          },
          {
            title: 'Make Public',
            dataIndex: 'public',
            key: 'public',
            width: '10%',
            align: 'left',
            render: () => (
              <Switch
              />)
          }

    ]

    const studColumns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: '30%',
        sorter: {
          compare: (a, b) => (a.name < b.name ? -1 : 1),
        },
      },
      {
        title: 'Assessments',
        dataIndex: 'assessments',
        keyIndex: 'assessments',  
        width: '30%',
        render: () => (
          <StudentAssessmenmts/>
        ),
        
      },
      {
        title:'Grade',
        dataIndex:'grade',
        keyIndex:'grade',
        editable:true, 
        width:'20%'
      }
    ]

    
    const showModal = () => {
      setVisible(true);
  };
  const handleCancel = () => {
    setVisible(false)
};

const handleOk = () => {
    setVisible(false)
}

const handleBack = () => {
  navigate('/dashboard');
};
    return (

        <div>
          <button id='home-back-btn' onClick={handleBack}>
            <i className='fa fa-arrow-left' aria-hidden='true' />
          </button>
          <Button id="assessment" onClick={showModal} >
            Create Assessment
          </Button>
          <div>
          <div id='page-header'>
            <h1>Assessments</h1>
          </div>
          <div id='content-creator-table-container' style={{ marginTop: '6.6vh' }}>
            <Table columns={wsColumn} dataSource={assessments}/>
          </div>
          <Modal
                title={"Create Assessment"}
                visible={visible}
                onCancel={handleCancel}
                width={'75vw'}
                footer={[
                    <Button key="ok" type="primary" onClick={handleOk}>
                        Cancel
                    </Button>,
                ]}
            >
                <QuestionForm id={classroomId}/>
            </Modal>
            </div>
            <div>
                <div id="page-header">
                  <h1>Students Assessments</h1>
                </div>
                <div id='content-creator-table-container' style={{ marginTop: '6.6vh' }}>
                  <Table columns={studColumns} dataSource={names} />
                </div>
            </div>
        </div>
    )
}

export default Assessments;