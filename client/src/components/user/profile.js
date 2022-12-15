import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import { MDBTable, MDBTableHead, MDBTableBody, MDBContainer} from 'mdb-react-ui-kit';


const RegisteredCourse = (props) => (
  <tr>
    <td>{props.index}</td>
    <td >{props.course.title}</td>
    <td>{props.course.description}</td>
    <td>{props.course.faulty}</td>
    <td>
      {props.course.weekday}({props.course.startTime}--{props.course.endTime})
    </td>
  </tr>
 );

const Comment = (props) => (
  <tr>
      <td>{props.index}</td>
      <td >
        <Link className="btn btn-link" to={`/details/profile/${encodeURIComponent(props.comment.newsTitle)}`}>{props.comment.newsTitle}</Link>
      </td>
      <td>{props.comment.comment}</td>
      <td>{props.comment.createdAt}</td>
  </tr>
);

export default function Profile() {
  let email=localStorage.getItem('user-info')

  const [form, setForm] = useState({
    _id:"",
    username: "",
    email:"",
    password: "",
    kind:"",
    grade:"",
    college:"",
    courses:[],
    comments:[]
  });

  function updateForm(value) {
    return setForm((prev) => {
        return { ...prev, ...value };
    });
  } 

  // get the register data
  useEffect(() => {
    async function fetchData() {
    
      const response = await fetch(`http://localhost:5000/getProfileInfo`,{
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email:email,
        })
    })
  
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }
  
      const user = await response.json();
      updateForm(user);
    }
  
    fetchData();
  
    return;
  }, []);

  const RenderMenu=()=>{
    if(form.kind === "Faulty"){
        return(
          <tr>
            <td>College:</td>
            <td>
                {form.college}
            </td>
          </tr>     
        )
      }else{
        return(
          <tr>
            <td>Grade:</td>
            <td>
                {form.grade}
            </td>
          </tr>
        )
      }
  }

  function commentList() {
    return form.comments.map((comment, index) => {
    return (
        <Comment
        comment={comment}
        key={comment._id}
        index={index+1}
        />
    );
    });
  }

  function registeredCourseList(){
    return form.courses.map((course, index) => {
        return (
            <RegisteredCourse
            course={course}
            key={course._id}
            index={index+1}
            />
        );
        });
  }

  return (
    <MDBContainer>
      
      <MDBTable hover  responsive>
          <MDBTableHead >
              <tr>
                  <th>Profile Information</th>
                  <th style={{display: "flex"}}>
                    <Link className="btn btn-link" to={`/editprofile/${form._id.toString()}`} style={{marginLeft: "auto"}}>Edit Profile</Link>
                  </th>
              </tr>
          </MDBTableHead>
          <MDBTableBody>
              <tr>
                  <td>Name:</td>
                  <td >
                      {form.username}
                  </td>
              </tr>
              <tr>
                  <td>Email:</td>
                  <td>
                      {form.email}
                  </td>
              </tr>
              <tr>
                  <td>Password:</td>
                  <td>
                      {form.password}
                  </td>
              </tr>
              <tr>
                  <td>Role:</td>
                  <td>
                      {form.kind}
                  </td>
              </tr>
              <RenderMenu />
          </MDBTableBody>            
      </MDBTable>
      {form.kind==="Faulty"?<b>Created Courses List</b>:<b>Registered Courses List</b>}
      <div className="tableFixHead">
      <MDBTable hover  className='table'>
          <MDBTableHead className='head'>
              <tr>
                  <th>Index</th>
                  <th>Course Title</th>
                  <th>Course Description</th>
                  <th>Faulty</th>
                  <th>Meeting Time</th>
              </tr>
          </MDBTableHead>
          <MDBTableBody className='head'>
              {form.courses.length?registeredCourseList():<tr><td colSpan={6}>No course found!</td></tr>}
          </MDBTableBody>
      </MDBTable>
      </div>
      <b>Comments List</b>
      <div className="tableFixHead" >
          <MDBTable hover className='table'>
              <MDBTableHead className='head'>
                <tr>
                    <th>Index</th>
                    <th>News Title</th>
                    <th>Comment</th>
                    <th>CreatedAt</th>
                </tr>
              </MDBTableHead >
              <MDBTableBody className='head'>
                {form.comments.length?commentList():<tr><td colSpan={6}>No comment found!</td></tr>}
              </MDBTableBody>
          </MDBTable>
      </div>
    </MDBContainer>
  )
}


