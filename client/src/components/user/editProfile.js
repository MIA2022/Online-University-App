import React, { useState, useEffect } from 'react'
import Form from 'react-bootstrap/Form';
import { useNavigate } from "react-router";
import { MDBRadio, MDBContainer } from 'mdb-react-ui-kit';

export default function EditProfile() {
    let email=localStorage.getItem('user-info')

    const [form, setForm] = useState({
        username: "",
        email:"",
        password: "",
        grade:"",
        kind:"",
        college:"",
        _id:""
    });

    function updateForm(value) {
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    } 

    const navigate=useNavigate();

    const [formErrors, setFormErrors]=useState({})
    const [isSubmit, setIsSubmit]=useState(false)

    const validate=(user)=>{
        const errors={}
        const regex=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i
        if(!user.username){
            errors.username="Username is required!"
        }
        if(!user.password){
            errors.password="Password is required!"
        }else if(user.password.length<4){
            errors.password="Password must be more then 4 characters!"
        }else if(user.password.length>10){
            errors.password="Password cannot be more then 10 characters!"
        }
        return errors;
    }

    // validate the update data and update the data
    useEffect(()=>{
        if(Object.keys(formErrors).length===0&&isSubmit){
            const newUser = { ...form };
            updateProfile(newUser);
        }}, [formErrors])

    // get profile data
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
        });
      
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
      }, [email]);

    const RenderMenu=()=>{
        if(form.kind === "Faulty"){
            return(
                <>
                    <p>College</p>
                    <MDBRadio name='inlineRadio' id='inlineRadio10' value='College of Arts, Media and Design' label='College of Arts, Media and Design' inline 
                        checked={form.college === "College of Arts, Media and Design"} 
                        onChange={(e) => updateForm({ college: e.target.value })}/>
                    <MDBRadio name='inlineRadio' id='inlineRadio20' value='College of Business' label='College of Business' inline 
                    checked={form.college === "College of Business"}
                    onChange={(e) => updateForm({ college: e.target.value })}
                    />
                    <MDBRadio name='inlineRadio' id='inlineRadio30' value='College of Computer Sciences' label='College of Computer Sciences 'inline 
                    checked={form.college === "College of Computer Sciences"}
                    // defaultChecked
                    onChange={(e) => updateForm({ college: e.target.value })}
                    />
                    <MDBRadio name='inlineRadio' id='inlineRadio40' value='College of Engineering' label='College of Engineering' inline 
                    checked={form.college === "College of Engineering"}
                    onChange={(e) => updateForm({ college: e.target.value })}
                    />
                    <MDBRadio name='inlineRadio' id='inlineRadio50' value='College of Health Sciences' label='College of Health Sciences' inline 
                    checked={form.college === "College of Health Sciences"}
                    onChange={(e) => updateForm({ college: e.target.value })}
                    />
                    <MDBRadio name='inlineRadio' id='inlineRadio60' value='College of Social Sciences' label='College of Social Sciences'inline 
                    checked={form.college === "College of Social Sciences"}
                    onChange={(e) => updateForm({ college: e.target.value })}
                    />
                </>        
            )
            }else{
            return(
                <>
                    <p>Subject</p>
                    <MDBRadio name='inlineRadio1' id='inlineRadio70' value='Undergraduate' label='Undergraduate' inline 
                        checked={form.grade === "Undergraduate"} 
                        onChange={(e) => updateForm({ grade: e.target.value })}/>
                    <MDBRadio name='inlineRadio1' id='inlineRadio80' value='Graduate' label='Graduate' inline 
                    checked={form.grade === "Graduate"}
                    // defaultChecked
                    onChange={(e) => updateForm({ grade: e.target.value })}
                    />
                    <MDBRadio name='inlineRadio1' id='inlineRadio90' value='Phd' label='Phd'inline 
                    checked={form.grade === "Phd"}
                    onChange={(e) => updateForm({ grade: e.target.value })}
                    />
                </>
            )
            }
        }

    async function updateProfile(user){
        await fetch(`http://localhost:5000/updateProfile/${form._id.toString()}`, {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
            'Content-Type': 'application/json'
            },
        });
        navigate("/profile");
    }

    //edit profile data
    function onSubmit(e) {
        e.preventDefault();
        const editedProfile = { ...form };
        setFormErrors(validate(editedProfile))
        setIsSubmit(true)
    }

  return (
    <MDBContainer>
      <h4>Update Profile</h4>
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="text"  value={form.email} onChange={(e) => updateForm({ email: e.target.value })} disabled/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" value={form.username} onChange={(e) => updateForm({ username: e.target.value })}/>
            <p className='error'>{formErrors.username}</p>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control  type="password" value={form.password} onChange={(e) => updateForm({ password: e.target.value })}/>
            <p className='error'>{formErrors.password}</p>
        </Form.Group>
        <Form.Label>Role</Form.Label>
        <br/>
        <MDBRadio name='inlineRadio3' id='inlineRadio1' value='Faulty' label='Faulty' inline 
        checked={form.kind === "Faulty"} disabled 
        />
        <MDBRadio name='inlineRadio3' id='inlineRadio2' value='Student' label='Student'inline 
        checked={form.kind === "Student"} disabled 
        />
        <RenderMenu />
        <div className="form-group">
         <input
           type="submit"
           value="Update Profile"
           className="btn btn-outline-primary"
         />
       </div>
      </Form>
    </MDBContainer>
  )
}
