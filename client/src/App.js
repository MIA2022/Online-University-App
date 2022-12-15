import React, {createContext, useEffect, useReducer, useState} from "react";

// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
 
// We import all the components we need in our app
import NavigationBar from "./components/navigationBar";
import Register from './components/user/register';
import Login from "./components/user/login";
import Profile from "./components/user/profile";
import { initialState, reducer } from "./components/useReduce";
import Search from "./components/news/search";
import Result from "./components/news/result";
import Detail from "./components/news/detail";
import Create from "./components/course/create";
import Edit from "./components/course/edit";
import Searchcourse from "./components/course/studentCourse";
import EditProfile from "./components/user/editProfile";
import StudentCourse from "./components/course/studentCourse";
import FaultyCource from "./components/course/faultyCource";
import AnonymousProfile from "./components/user/anonymousProfile";
import Home from "./components/home";
import StudentList from "./components/course/studentList";

import './App.css';


export const UserContext=createContext()

const App = () => {
    let email=localStorage.getItem('user-info')

    useEffect(()=>{
        async function checkUserRole(){
            const response = await fetch("http://localhost:5000/checkRole", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({email:email}),
            })
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            const role= await response.json();
            console.log('role', role)
            setRole(role.role)
        }
        if(email){
            checkUserRole()
        }
        return;
    }, [email])

    

    const [state, dispatch]=useReducer(reducer, initialState)
    const [role, setRole]= useState("")
    
    return (
   
        <div>
            <UserContext.Provider value={{state, dispatch}}>
                <NavigationBar  />
                <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/login/:previous/:title" element={<Login />} />
                    <Route path="/studentList/:id" element={<StudentList/>} />

                    <Route path="/register" element={<Register />} />
                    <Route path="/profile" element={email?<Profile />:<><h3 className="error loginErr">You should Login first!</h3><Login /></>} />
                    <Route path="/profile/:previous/:id/:title" element={<AnonymousProfile />} />

                    <Route path="/search" element={<Search />} />
                    <Route path="/results/:criteria" element={<Result />} />
                    <Route path="/details/:previous/:title" element={<Detail />} />

                    <Route path="/course" element={email?(role==="Faulty"?<FaultyCource />:<StudentCourse/>):<><h3 className="error loginErr">You should Login first!</h3><Login /></>} />

                    <Route path="/edit/:id" element={<Edit />} />
                    <Route path="/create" element={<Create />} />
                    <Route path="/searchcourse" element={<Searchcourse />} />
                    <Route path="/editprofile/:id" element={<EditProfile />} />
                </Routes>
            </UserContext.Provider>
        </div>
 );
};
 
export default App;