import React , {useContext, useState, useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link } from "react-router-dom";
import { useParams, useNavigate } from "react-router";
import { UserContext } from '../../App';

export default function Login() {
    const {state, dispatch}= useContext(UserContext)

    const [formErrors, setFormErrors]=useState({})
    const [isSubmit, setIsSubmit]=useState(false)

    const params = useParams();

    // check whether enter the login page through news comment
    if(params.title){
        var title= decodeURIComponent(params.title).toString();
    }
    

    useEffect(()=>{
        console.log(formErrors)
        if(Object.keys(formErrors).length===0&&isSubmit){
            const newUser = { ...form };
            checkLoginInfo( newUser)
        }}, [formErrors])

    const [form, setForm] = useState({
        email: "",
        password: "",
      });

    const navigate = useNavigate();

    function updateForm(value) {
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    }

    function  handleSubmit(e){
        e.preventDefault()
        const newLoginUser = { ...form }
        setFormErrors(validate(newLoginUser))
        setIsSubmit(true)
    }

    // This method will check whether email and password are right
    async function checkLoginInfo(user) {
    
        const response = await fetch("http://localhost:5000/checkLoginInfo", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({email:user.email, password:user.password}),
        })
        if (!response.ok) {
            const message = `An error occurred: ${response.statusText}`;
            window.alert(message);
            return;
        }
        const users= await response.json();
        if(users[0].email&&users[0].password&&title){
            dispatch({type:"USER", payload:true})
            localStorage.setItem('user-info', users[0].email)
            setForm({ email: "", password: ""});
            navigate(`/details/${params.previous}/${encodeURIComponent(title)}`);
        }else if(users[0].email&&users[0].password){
            dispatch({type:"USER", payload:true})
            localStorage.setItem('user-info', users[0].email)
            setForm({ email: "", password: ""});
            navigate("/");
        }else if(users[0].email&&!users[0].password){
            setLoginResult("Password is wrong!")
        }else if(!users[0].password&&!users[0].email){
            setLoginResult("Email doesn't exit!")
        }
    }

    const [loginResult, setLoginResult]=useState("")
    
    const validate=(user)=>{
        const errors={}
        const regex=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i
        if(!user.email){
            errors.email="Email is required!"
        }else if(!regex.test(user.email)){
            errors.email="This is not a valid email format!"
        }
        if(!user.password){
            errors.password="Password is required!"
        }
        console.log(errors)
        return errors;
    }


  return (
    
    <div className='auto-form-container'>
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail" >
                <Form.Label>Email</Form.Label>
                <Form.Control type="text" placeholder='abc@xxx.com' value={form.email} onChange={(e) => updateForm({email: e.target.value })}/>
                <p className='error'>{formErrors.email}</p>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder='Password' value={form.password} onChange={(e) => updateForm({ password: e.target.value })}/>
                <p className='error'>{formErrors.password}</p>
            </Form.Group>
            <Button variant="primary" type="submit">
                Sign in
            </Button>
            <span className='error'>{loginResult}</span>
        </Form>
        <Link className="btn btn-link" to={`/register`}>Don't have an account?Register here.</Link>
       
    </div>
    
  )
}

