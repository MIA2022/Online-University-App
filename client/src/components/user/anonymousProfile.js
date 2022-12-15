import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";
import { useParams,useNavigate } from "react-router";
import { BsArrowLeft } from "react-icons/bs";
import { MDBTable, MDBTableHead, MDBTableBody, MDBContainer} from 'mdb-react-ui-kit';
import Profile from './profile';

const Comment = (props) => (
    <tr>
        <td>{props.index}</td>
        <td >
          <Link className="btn btn-link" to={`/details/${props.previous}/${encodeURIComponent(props.comment.newsTitle)}`}>{props.comment.newsTitle}</Link>
        </td>
    </tr>
  );


export default function AnonymousProfile() {

    let email=localStorage.getItem('user-info')

    const [form, setForm] = useState({
        _id:"",
        username: "",
        email:"",
        kind:"",
        comments:[]
    });

    function updateForm(value) {
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    }
    const params = useParams();
    const navigate=useNavigate();
    // get the register data
    useEffect(() => {
        async function fetchData() {
        const response = await fetch(`http://localhost:5000/profileInfo/${params.id.toString()}`)
    
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
    }, [params.id, email, navigate]);

    const previous=params.previous
    function commentList() {
        return form.comments.map((comment, index) => {
        return (
            <Comment
            comment={comment}
            key={comment._id}
            index={index+1}
            previous={previous}
            />
        );
        });
      }
    
    const RenderMenu=()=>{
        console.log('form.email',form.email)
        console.log('email', email)
        if(form.email===email){
            return <Profile />
        }else{
            return (
            <>
                <MDBTable hover  responsive>
                    <MDBTableHead >
                        <tr>
                            <th>Profile Information</th>
                            <th></th>
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
                            <td>Role:</td>
                            <td>
                                {form.kind}
                            </td>
                        </tr>
                    </MDBTableBody>            
                </MDBTable>
                <b>Comments News</b>
                <div className="tableFixHead" >
                    <MDBTable hover className='table'>
                        <MDBTableHead className='head'>
                            <tr>
                                <th>Index</th>
                                <th>News Title</th>
                            </tr>
                        </MDBTableHead >
                        <MDBTableBody className='head'>
                            {form.comments?commentList():<tr><td colSpan={6}>No comment found!</td></tr>}
                        </MDBTableBody>
                    </MDBTable>
                </div>
            </>
            )
        }
    }

  return (
    <MDBContainer>
        <div>
            <Button variant="outline-success" tag="a" href={`/details/${previous}/${encodeURIComponent(params.title)}`}>
                <BsArrowLeft />Back
            </Button>
        </div>
        <RenderMenu />
    </MDBContainer>
  )
}
