import React, { useEffect, useState } from 'react';
import { Modal, Button, Table } from 'antd';
import { getClassAssessment, getStudentClassAssessments } from '../../Utils/requests';
import CompletedAssessment from './CompletedAssessment';

//Page to view the assessments a student has taken and a button to view their answers to an assessment
//This component is used when a view button for a particular student is clicked
function StudentAssessments({ stuId, classId }) {
  //Store the assessments and their associated data
  const [assessments, setAssessments] = useState([]);
  //Store the visibility of the modal for each assessment the student has taken
  const [view, setView] = useState(new Array(getStudentClassAssessments(stuId, classId).then((res) => res.data.length)).fill(false));
  //Column name of the table to display the assessments
  const columns = [
    {
      title: 'Assessment Name',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      sorter: {
        compare: (a, b) => (a.name < b.name ? -1 : 1),
      },
    },
    {
      title: 'View Assessments',
      dataIndex: 'assessments',
      keyIndex: 'assessments',
      width: '30%',

    },
    {
      title: 'Grade',
      dataIndex: 'grade',
      keyIndex: 'grade',
      editable: true,
      width: '20%'
    }
  ]

  function viewWork(i) {
    let temp = [...view];
    temp[i] = true;
    setView(temp);
  }

  function leaveWork(i) {
    let temp = [...view];
    temp[i] = false;
    setView(temp);
  }

  //Upon rereendering, get the assessments
  //The modal for each assessment is created here
  useEffect(() => {

    getStudentClassAssessments(stuId, classId).then((res) => {
      if (res.data) {
        const data = [];
        res.data.forEach((assessment, i) => {

          data.push({
            key: assessment.id,
            name: assessment.assessmentName,
            assessments: (
              <>
                <Button
                  type="primary"
                  onClick={() => {
                    viewWork(i);
                  }}
                >
                  View
                </Button>
                <Modal
                  title={"View Assessment"}
                  visible={view[i]} // Change 'open' to 'visible'
                  onCancel={() => leaveWork(i)}
                  width={'75vw'}
                  footer={[
                    <Button key="ok" type="primary" onClick={() => leaveWork(i)}>
                      Cancel
                    </Button>,
                  ]}
                >
                  <CompletedAssessment name={assessment.assessmentName} answers={assessment.answers} classId={classId} />
                </Modal>
              </>
            ),
            grade: "N/A",
          });
        });

        setAssessments(data);
      } else {
        console.log("error");
      }
    });


  }, [view]);
  return (
    <div>
      <Table columns={columns} dataSource={assessments} />
    </div>
  );
}

export default StudentAssessments;