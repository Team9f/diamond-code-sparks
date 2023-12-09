
import { Table, Popconfirm, message } from 'antd';
import {Modal,Button,Switch} from 'antd';
import { useEffect, useState } from 'react';
import { updateAssessmentPublic,deleteAssessment, getAssessments, getClassroom } from '../../Utils/requests';
import StudentAssessments from './StudentAssessments';
import './assessmentStyle.css';
import QuestionForm from '../AssesmentsCreate/QuestionForm';
import ViewAssessment from './ViewAssessment';


//Creates the page on the Teacher view of the Assessments
//Get access to creating assessments, assessment managament, and student assessments
function Assessments({ classroomId})
{
    //Store the names of the students and their associated data
    const [names,setNames]=useState([]);
    //Store the assessments and their associated data
    const [assessments,setAssessments]=useState([]);
    //Store the visibility of the modal
    const [visible, setVisible] = useState(false);
    //Store the visibility of the modal for each assessment
    const [view,setView] = useState(new Array(getAssessments().then((res)=>res.data.length)).fill(false));
    //Store the visibility of the modal for each student assessments
    const [stView,setStView] = useState(new Array(getClassroom(classroomId).then((res) => res.data.students.length)).fill(false));


    //The four functions control the view of a specific modal for a spceific assessment or student view
    const viewWork = (i) => {
      let temp = [...view];
      temp[i] = true;
      setView(temp);
    }

    const leaveWork = (i) => {
      let temp = [...view];
      temp[i] = false;
      setView(temp);
    }

    const viewStWork = (i) => {
      let temp = [...stView];
      temp[i] = true;
      setStView(temp);
    }

    const leaveStWork = (i) => {
      let temp = [...stView];
      temp[i] = false;
      setStView(temp);
    }

    

    //Upon rereendering, get the students and assessments
    useEffect(() => {

      //Create list of students and the view for their assessments with a modal of the StudentAssesments component
      getClassroom(classroomId).then((res) => {
        if (res.data) {
          let newNames=[];
          console.log(res.data.students);
          res.data.students.forEach((student,i) => newNames.push({key: student.id,name:student.name,assessments:
            //Modal for the student assessments view
            <>
                  <Button type="sucess" onClick={()=>viewStWork(i)}>
                    View
                  </Button>
                  <Modal
                    title={"View Assessment"}
                    visible={stView[i]} // Change 'open' to 'visible'
                    onCancel={leaveStWork}
                    width={'75vw'}
                    footer={[
                      <Button key="ok" type="primary" onClick={()=>leaveStWork(i)}>
                        Cancel
                      </Button>,
                    ]}
                  >
                    <StudentAssessments stuId={student.id} classId={classroomId}/>
                </Modal>
            </>
            ,grade:"N/A"}));

          setNames([...newNames]);
        } else {
          message.error(res.err);
        }
      });
      //Get all assessments and the assessment with correct id is stored in assesments table
      //The assessments data has modal to open the assesment to preview it
      //The assessments data has a delete button to delete the assessment
      //The assessments data has a switch to make the assessment public or private. This will affect if the student can access the assessment
      getAssessments().then((res) => {
        let temp = [];
        for(let i=0;i<res.data.length;i++){
            if(res.data[i].classroomID==classroomId){
              
              temp.push({
                key:res.data[i].id,
                name:res.data[i].assessmentName,
                description:res.data[i].description,
                open:
                //Modal for the assessment view of created assessment by teacher
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
                    <ViewAssessment name= {res.data[i].assessmentName} description = {res.data[i].description} questions = {res.data[i].questions}/>
                </Modal>
            </>
                ,
                //Button to delete the assessment. There is a popup to confirm deleting the assessment
                delete:<Popconfirm title="Sure to delete?" onConfirm={() => {
                  deleteAssessment(res.data[i].id);
                  message.success('Deleted');
                }}>
                <Button type="primary" danger>
                    Delete
                </Button>
                </Popconfirm>,
                //Switch to change if the assessment is visible or not to students
                public:<Switch defaultChecked={res.data[i].isPublic} onChange={()=> {updateAssessmentPublic(res.data[i].id,res.data[i].isPublic); res.data[i].isPublic = !res.data[i].isPublic}}/>,
              
              });
          }
        }
        setAssessments([...temp]);

      });
    }, [classroomId,visible,view,stView]);

    //Create the column headers for the table displaying all assessments
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
            title: 'Make Visible',
            dataIndex: 'public',
            key: 'public',
            width: '10%',
            align: 'left'
          }

    ]

    //The columns of the student assessments table
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