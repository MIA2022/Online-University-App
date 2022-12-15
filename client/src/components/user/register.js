import React, { useState, useContext, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import { UserContext } from '../../App';
import { MDBRadio } from 'mdb-react-ui-kit';


export default function Register() {
    const {state, dispatch}= useContext(UserContext)
    const [form, setForm] = useState({
        username: "",
        email:"",
        password: "",
        role:"Student",
        grade:"Graduate",
        college:"College of Computer Sciences"
    });

    const [formErrors, setFormErrors]=useState({})
    const [isSubmit, setIsSubmit]=useState(false)

    const navigate = useNavigate();

    function updateForm(value) {
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    }

    //validate data and register user
    useEffect(()=>{
        if(Object.keys(formErrors).length===0&&isSubmit){
            const newUser = { ...form };
            registerUser(newUser);
        }}, [formErrors])

    const [registerResult, setRegisterResult]=useState("")

    async function registerUser(user) {
        const response = await fetch("http://localhost:5000/register", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        })
        if (!response.ok) {
            const message = `An error occurred: ${response.statusText}`;
            window.alert(message);
            return;
        }
        const users= await response.json();
        console.log('users',users)
        if(users[0].email){
            dispatch({type:"USER", payload:true})
            localStorage.setItem('user-info', users[0].email)
            navigate("/");
        }else {
            setRegisterResult(users[0].message)
        }
    }

    //get the data
    function handleSubmit(e){
        e.preventDefault();
        const newUser = { ...form };
        setFormErrors(validate(newUser))
        setIsSubmit(true)
    }
        
    const RenderMenu=()=>{
        if(form.role === "Faulty"){
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
                    <p>Grade</p>
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
    
    const validate=(user)=>{
        const errors={}
        const regex=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i
        if(!user.email){
            errors.email="Email is required!"
        }else if(!regex.test(user.email)){
            errors.email="This is not a valid email format!"
        }
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

  return (
    <div className='auto-form-container'>
        <Form onSubmit={handleSubmit} >

        <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="text" placeholder='abc@xxx.com'  value={form.email} onChange={(e) => updateForm({ email: e.target.value })}/>
            <p className='error'>{formErrors.email}</p>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder='Name' value={form.username} onChange={(e) => updateForm({ username: e.target.value })}/>
            <p className='error'>{formErrors.username}</p>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control  type="password" placeholder='Password' value={form.password} onChange={(e) => updateForm({ password: e.target.value })}/>
            <p className='error'>{formErrors.password}</p>
        </Form.Group>

        <Form.Label>Role</Form.Label>
        <br/>
        <MDBRadio name='inlineRadio3' id='inlineRadio1' value='Faulty' label='Faulty' inline 
        checked={form.role === "Faulty"} onChange={(e) => updateForm({ role: e.target.value })}
        />
        <MDBRadio name='inlineRadio3' id='inlineRadio2' value='Student' label='Student'inline 
        checked={form.role === "Student"} onChange={(e) => updateForm({ role: e.target.value })}
        />
        <RenderMenu />
        <br/>
        <br/>
        <Button variant="outline-success" type="submit" >
            Sign Up
        </Button>
        <span className='error'>{registerResult}</span>
    </Form>
    <Link className="btn btn-link" to={`/login`}>Already have an account? Login here.</Link>
    </div>
  )
}

