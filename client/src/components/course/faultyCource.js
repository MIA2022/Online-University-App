import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import { MDBTable, MDBTableHead, MDBTableBody, MDBContainer} from 'mdb-react-ui-kit';

const Course = (props) => (
    <tr>
      <td>{props.id}</td>
      <td>
        <Link className="btn btn-link" to={`/studentList/${props.course._id}`}>{props.course.title}</Link>
      </td>
      <td>{props.course.description}</td>
      <td>
        <p>{props.course.weekday}({props.course.startTime}--{props.course.endTime})</p>

      </td>
      <td>
        <Link className="btn btn-link" to={`/edit/${props.course._id}`}>Edit</Link> |
        <button className="btn btn-link"
          onClick={() => {
            props.deleteCourse(props.course._id);
          }}
        >
          Delete
        </button>
      </td>
    </tr>
   );

export default function FaultyCource() {
    
    const [courses, setCourses] = useState([]);
    let email=localStorage.getItem('user-info')

    useEffect(() => {
        async function getCourses() {
          const response = await fetch(`http://localhost:5000/faultyCourseList`,{
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({email:email}),
          });
      
          if (!response.ok) {
            const message = `An error occurred: ${response.statusText}`;
            window.alert(message);
            return;
          }
          const courses = await response.json();
          console.log(courses)
          setCourses(courses);
        }
      
        getCourses();
      
        return;
      }, [courses.length]);

      async function deleteCourse(id) {
        console.log(id)
        await fetch(`http://localhost:5000/delete/${id}`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            },
          body: JSON.stringify({email:email}),
        });
      
        const newCourses = courses.filter((el) => el._id !== id);
        setCourses(newCourses);
      }

      function courseList() {
        return courses.map((course, index) => {
          return (
            <Course
              course={course}
              deleteCourse={() => deleteCourse(course._id)}
              key={course._id}
              id={index+1}
            />
          );
        });
      }

  return (
    <MDBContainer>
     <h4>Course List</h4>
     <MDBTable className="table table-striped" style={{ marginTop: 20 }}>
       <MDBTableHead>
         <tr>
            <th>Index</th>
           <th>Course Title</th>
           <th>Course Description</th>
           <th>Meeting Time</th>
         </tr>
       </MDBTableHead>
       <MDBTableBody>
            {courses.length?courseList():<tr><td colSpan={6}>No course found!</td></tr>}
        </MDBTableBody>
     </MDBTable>
     <Button  tag="a" href="/create" variant="outline-success" >
                Add new course
    </Button>
   </MDBContainer>
  )
}
