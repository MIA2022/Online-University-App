import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import { MDBTable, MDBTableHead, MDBTableBody, MDBContainer} from 'mdb-react-ui-kit';


const UserComment = (props) => (
    <tr>
        <td>{props.index}</td>
        <td >
          <Link className="btn btn-link" to={`/details/home/${encodeURIComponent(props.comment.newsTitle)}`}>{props.comment.newsTitle}</Link>
        </td>
        <td>{props.comment.comment}</td>
        <td>{props.comment.createdAt}</td>
    </tr>
  );

const Comment = (props) => (
    <tr>
        <td>{props.index}</td>
        <td >
            <Link className="btn btn-link" to={`/details/home/${encodeURIComponent(props.comment)}`}>{props.comment}</Link>
        </td>
    </tr>
);

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

export default function Home() {
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

  const[comments, setComments]=useState([])

  // get the profile data
  useEffect(() => {
    async function fetchUserData() {
    
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

    async function fetchCommentData() {
    
        const response = await fetch(`http://localhost:5000/searchComment`)
    
        if (!response.ok) {
          const message = `An error has occurred: ${response.statusText}`;
          window.alert(message);
          return;
        }
    
        const comments = await response.json();
        if(comments.length<10){
            setComments(comments)
        }else{
            const newComments=comments.slice(0, 10)
            setComments(newComments);
        }
        
      }

    if(email){
        fetchUserData();
    }else{
        fetchCommentData();
    }
    
    return;
  }, [email]);

  function commentList() {
    return comments.map((comment, index) => {
        return (
            <Comment
            comment={comment}
            key={index}
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

  function userCommentList() {
    return form.comments.map((comment, index) => {
    return (
        <UserComment
        comment={comment}
        key={comment._id}
        index={index+1}
        />
    );
    });
  }

  const RenderMenu=()=>{
    if(email){
        return (
            <>
                <br/>
                <h2>Welcome, {form.username}!</h2>
                <br/>
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
                <b>Commented News List</b>
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
                            {form.comments.length?userCommentList():<tr><td colSpan={6}>No comment found!</td></tr>}
                        </MDBTableBody>
                    </MDBTable>
                </div>
            </>
        )
    }else{
        return (
        <>
            <br/>
            <h2>Welcome!</h2>
            <br/>
            <h5>The Latest Commented Top-headline News</h5>
            <br/>
            <div  >
                <MDBTable hover >
                    <MDBTableHead>
                        <tr>
                            <th>Index</th>
                            <th>News Title</th>
                        </tr>
                    </MDBTableHead >
                    <MDBTableBody>
                        {comments.length?commentList():<tr><td colSpan={6}>No news found!</td></tr>}
                    </MDBTableBody>
                </MDBTable>
            </div>
        </>
        )
    }
}

  return (
    <MDBContainer>
        <RenderMenu/>
    </MDBContainer>
  )
}
