import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from "react-router";
import { MDBTable, MDBTableHead, MDBTableBody, MDBContainer} from 'mdb-react-ui-kit';
import Button from 'react-bootstrap/Button';
import { BsArrowLeft } from "react-icons/bs";

const Student = (props) => (
    <tr>
      <td>{props.id}</td>
      <td>{props.student.username}</td>
      <td>{props.student.email}</td>
    </tr>
   );

export default function StudentList() {

    const params = useParams();
    const navigate = useNavigate();

    const[students, setStudents]=useState([])

    useEffect(() => {
        async function getStudents() {
          const response = await fetch(`http://localhost:5000/studentList/${params.id}`);
      
          if (!response.ok) {
            const message = `An error occurred: ${response.statusText}`;
            window.alert(message);
            return;
          }
          const students = await response.json();
          console.log(students)
          setStudents(students);
        }
      
        getStudents();
      
        return;
      }, [students.length, params.id]);


    function studentList() {
        return students.map((student, index) => {

          return (
            <Student
              student={student}
              key={student._id}
              id={index+1}
            />
          );
        });
      }

    const backToList=()=>{
        navigate(`/course`);
    }

  return (
    <MDBContainer>
        <Button variant="outline-success" onClick={backToList} className="clickButton">
                <BsArrowLeft />Back
        </Button>
    
     <h4>Student List</h4>
     <MDBTable hover striped style={{ marginTop: 20 }}>
       <MDBTableHead>
         <tr>
            <th>Index</th>
            <th>Name</th>
            <th>Email</th>
         </tr>
       </MDBTableHead>
       <MDBTableBody>
            {students.length?studentList():<tr><td colSpan={6}>No student found!</td></tr>}
        </MDBTableBody>
     </MDBTable>
   </MDBContainer>
  )
}
