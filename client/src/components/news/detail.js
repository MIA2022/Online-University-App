import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from "react-router";
import Button from 'react-bootstrap/Button';
import { BsArrowLeft } from "react-icons/bs";
import { MDBTable, MDBTableHead, MDBTableBody, MDBContainer, MDBTextArea} from 'mdb-react-ui-kit';
import { Link } from "react-router-dom";
import Alert from 'react-bootstrap/Alert';


const Comment = (props) => (
    <tr>
        <td >
            <Link className="btn btn-link" to={`/profile/${props.previous}/${props.comment.userID}/${encodeURIComponent(props.comment.newsTitle)}`}>{props.comment.username}</Link>
        </td>
        <td>{props.comment.comment}</td>
        <td>{props.comment.createdAt}</td>
    </tr>
);
    
export default function Detail() {
    const [form, setForm] = useState({
        title: "",
        author: "",
        source: "",
        description: "",
        url: "",
        _id:"",
        comments:[]
    });

    const params = useParams();
    const navigate = useNavigate();

    const [criteria, setCriteria] = useState("")
    
    useEffect(() => {
        async function fetchData() {
            var title= decodeURIComponent(params.title).toString();
            setCriteria({criteria:title})
            const response = await fetch(`http://localhost:5000/detail`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({title:title}),
            })
         
          console.log(response)
          if (!response.ok) {
            const message = `An error has occurred: ${response.statusText}`;
            window.alert(message);
            return;
          }
          const record = await response.json();
          console.log('record',record)
          setForm(record);
        }
        fetchData();
        return;
      }, [params.title]);

    let newsCriteria=localStorage.getItem('criteria')

    // const backToList=()=>{
    //     navigate(`/results/${newsCriteria}`);
    // }

    function commentList() {
        return form.comments.map((comment, index) => {
        return (
            <Comment
            comment={comment}
            key={index}
            previous={previous}
            />
        );
        });
    }
    const [comment, setComment]=useState("")
    const [message, setMessage]=useState()

    const cancelSubmit=()=>{
        setComment({comment:""})
        return
    }

    const handleSubmit=async()=>{
        let email=localStorage.getItem('user-info')
        
        console.log(comment.comment)
        if(!comment.comment){
            setShow(true)
            setMessage('No content!')
            return
        }
        if(email){
            const response = await fetch('http://localhost:5000/addcomment',{
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email:email,
                comment:comment.comment,
                id:form._id,
                title:form.title
            }),         
            })
            if (!response.ok) {
                const message = `An error has occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            const record = await response.json();
            console.log(record)
            setForm(record);
            setComment({comment:""})
            return 
        }else{
            setComment({comment:""})
            setShow(true)
            setMessage('You should login first!')
            return
        }
    }

    const [show, setShow] = useState(true);

    const backToList=()=>{
        if(params.previous==="home"){
            navigate(`/`);
        }else if(params.previous==="profile"){
            navigate(`/profile`);
        }
        else if(params.previous==="result"){
            navigate(`/results/${newsCriteria}`);
        }
        
    }

    const previous=params.previous

  return (
    <MDBContainer>
        {/* {newsCriteria?
        <Button variant="outline-success" onClick={backToList}>
            <BsArrowLeft />Back
        </Button>:<></>} */}
        <Button variant="outline-success" onClick={backToList}>
                <BsArrowLeft />Back
        </Button>
        <MDBTable hover borderless responsive>
            <MDBTableHead>
                <tr>
                    <th></th>
                    <th className="text-center">Article Information</th>
                </tr>
            </MDBTableHead>
            <MDBTableBody>
                <tr>
                    <td>Title:</td>
                    <td >
                        {form.title}
                    </td>
                </tr>
                <tr>
                    <td>Author:</td>
                    <td>
                        {form.author}
                    </td>
                </tr>
                <tr>
                    <td>Source:</td>
                    <td>
                        {form.source}
                    </td>
                </tr>
                <tr>
                    <td>Description:</td>
                    <td>
                        {form.description}
                    </td>
                </tr>
                <tr>
                    <td>URL:</td>
                    <td>
                        <a href={form.url} target="_blank">{form.url}</a>
                        <p>Click url to get the full article content</p>
                    </td>
                </tr>

            </MDBTableBody>            
        </MDBTable>
        
        <h3>Add Comments</h3>
        <div>
            <MDBTextArea placeholder='Comments' id='textAreaExample' value={comment.comment} rows={1} onChange={(e) => setComment({ comment: e.target.value })}/>
        </div>
        {message && <Alert show={show} key="danger" variant="danger" onClose={() => setShow(false)} dismissible>{message}
            {message==='You should login first!'&&<Alert.Link href={`/login/${params.previous}/${encodeURIComponent(params.title).toString()}`}>  Please login in.</Alert.Link>}
        </Alert>}
        <br/>
        <div>
            <Button variant="outline-danger" className='mx-2'onClick={cancelSubmit}>
                Cancel
            </Button>
            <Button variant="outline-success" onClick={handleSubmit}>
                Submit
            </Button>
        </div>
        <br/>
        <h3>Comments List</h3>
        <MDBTable hover responsive>
              <MDBTableHead className='head'>
                <tr>
                    <th>Username</th>
                    <th>Comment</th>
                    <th>CreatedAt</th>
                </tr>
              </MDBTableHead >
            <MDBTableBody>
                {form.comments.length?commentList():<tr><td colSpan={6}>No comment found!</td></tr>}
            </MDBTableBody>
        </MDBTable>
    </MDBContainer>
  )
}
