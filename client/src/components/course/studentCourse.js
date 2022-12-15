import React, {useState, useEffect} from 'react'
import Button from 'react-bootstrap/Button';
import { MDBTable, MDBTableHead, MDBTableBody, MDBInput, MDBContainer} from 'mdb-react-ui-kit';

const RegisteredCourse = (props) => (
    <tr>
      <td>{props.course.title}</td>
      <td>{props.course.description}</td>
      <td>{props.course.faulty}</td>
      <td>
        {props.course.weekday}({props.course.startTime}--{props.course.endTime})
      </td>
      <td>
        <button className="btn btn-link" 
            onClick={() => {props.dropCourse(props.course._id)}}>
          Drop
        </button>
      </td>
    </tr>
   );


const Course = (props) => (
    <tr>
      <td>{props.course.title}</td>
      <td>{props.course.description}</td>
      <td>{props.course.faulty}</td>
      <td>
        {props.course.weekday}({props.course.startTime}--{props.course.endTime})
      </td>
      <td>
        <button className={props.className} disabled={props.disabled}
            onClick={() => {props.registerCourse(props.course._id, props.index)}}>
          Register
        </button>
      </td>
    </tr>
   );

   


export default function StudentCourse() {
    const [form, setForm] = useState({
        title:'',
        faulty: ''
    });

    function updateForm(value) {
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    } 
    const [courses, setCourses] = useState([]);

    // load all course list for student to register
    const [fetchData, setFetchData] = useState(true);

    const getCourses=()=>{
        console.log(fetchData)
        fetch('http://localhost:5000/studentCourseList')
        .then(response=>{return response.json()})
        .then(json=>{
                const courses=json
                setCourses(courses);
                const fetchData=false
                setFetchData(fetchData)
                return 
        })
      }
      
    if(fetchData){
        getCourses()
    }

    // load all course student has already registered
    let email=localStorage.getItem('user-info')

    const [registeredCourses, setRegisteredCourses] = useState([]);

    useEffect(() => {
        async function getRegisteredCourses() {
            console.log(email)
            const response = await fetch(`http://localhost:5000/registeredCourseList`,{
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email:email,
                }),
            });
    
        if (!response.ok) {
            const message = `An error occurred: ${response.statusText}`;
            window.alert(message);
            return;
        }
        const registeredCourses = await response.json();
        setRegisteredCourses(registeredCourses);
        }
    
        getRegisteredCourses();
    
        return;
    }, [registeredCourses.length, email]);

    // get the register/drop button status
    const [registeredCoursesID, setRegisteredCoursesID] = useState([]);
    
    useEffect(() => {
        async function getRegisteredCoursesID(){
            const response = await fetch(`http://localhost:5000/registeredCourseListID`,{
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email:email,
            }),
        });
      
          if (!response.ok) {
            const message = `An error occurred: ${response.statusText}`;
            window.alert(message);
            return;
          }
          const registeredCoursesID = await response.json();
          setRegisteredCoursesID(registeredCoursesID);
        }
        getRegisteredCoursesID()
  
    return;
    }, [registeredCoursesID.length, email])
    
    // clear button
    const getAllCourselist=(e)=>{
        e.preventDefault();
        fetch('http://localhost:5000/studentCourseList')
        .then(response=>{return response.json()})
        .then(json=>{
                const courses=json
                setCourses(courses);
                setForm({title:'', faulty:''})
                return 
    })}
    
    // search button
    const getNewCourselist=(e)=>{
        
        e.preventDefault();
        fetch('http://localhost:5000/searchCourse',{
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title:form.title,
            faulty:form.faulty,
        }),         
        }).then(response=>{return response.json()})
        .then(json=>{
                console.log(json)
                const courses=json
                setCourses(courses);
                return 
                
        })
        
      }

    // register course
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleActive = (index) => {
        setActiveIndex(index);
    };

    async function registerCourse(id, index) {
        const response = await fetch(`http://localhost:5000/register/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email:email,
                })
        });
        toggleActive(index)
        const registeredCourses=await response.json()
        setRegisteredCourses(registeredCourses)

        setRegisteredCoursesID(registeredCoursesID.concat([id.toString()]))
    }
  

    async function dropCourse(id) {
        setActiveIndex(null)
        const response = await fetch(`http://localhost:5000/drop/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email:email,
                })
        });
        const newRegisteredCoursesID= await response.json()
        setRegisteredCoursesID(newRegisteredCoursesID)
    
        const newRegisteredCourses = registeredCourses.filter((el) => el._id !== id);
        setRegisteredCourses(newRegisteredCourses);
        console.log('dropid',registeredCoursesID)
    }

    function courseList() {
        return courses.map((course, index) => {
            console.log('map registeredCoursesID',registeredCoursesID)
            const boolean=registeredCoursesID.includes(course._id.toString())
            console.log('boolean', boolean)
            console.log('activeIndex', activeIndex)
            return (
            <Course
            course={course}
            registerCourse={() => registerCourse(course._id, index)}
            key={course._id}
            registeredNumber={course.students.length}
            index={index}
            disabled={activeIndex===index}
            className={boolean?'btn btn-link disabled':'btn btn-link'}
            />
            );
        });
    }

    function registeredCourseList(){
        return registeredCourses.map((course) => {
            return (
                <RegisteredCourse
                course={course}
                dropCourse={() => dropCourse(course._id)}
                key={course._id}
                />
            );
            });
    }

  return (
    
    <MDBContainer>
        <div >
            <MDBTable hover borderless className='table'>
                <MDBTableHead className='head'>
                <tr>
                    <th>Find Classes</th>
                    <th></th>
                </tr>
                </MDBTableHead>
                <MDBTableBody>
                    <tr>
                        <td>Course Title</td>
                        <td>
                            <MDBInput  type='text' value={form.title}
                            onChange={(e) => updateForm({title: e.target.value })}/>
                        </td>
                    </tr>
                    <tr>
                        <td>Faulty</td>
                        <td>
                            <MDBInput  type='text' value={form.faulty}
                            onChange={(e) => updateForm({faulty: e.target.value })}/>
                        </td>
                    </tr>
                    <tr>
                    <th></th>
                    <th>
                        <Button variant="outline-danger" className='mx-2' onClick={getAllCourselist}>
                            Clear
                        </Button>
                        <Button variant="outline-success" onClick={getNewCourselist}>
                            Search
                        </Button>
                    </th>
                    </tr>
                </MDBTableBody>
            </MDBTable>
        </div>
        <b>Courses List</b>
        <div className="tableFixHead" >
            <MDBTable hover className='table' value={courses}>
                <MDBTableHead className='head'>
                    <tr>
                        <th>Course Title</th>
                        <th>Course Description</th>
                        <th>Faulty</th>
                        <th>Meeting Time(24H)</th>
                        <th>Action</th>
                    </tr>
                </MDBTableHead>
                <MDBTableBody className='head'>
                    {courses.length?courseList():<tr><td colSpan={6}>No course found!</td></tr>}
                </MDBTableBody>
            </MDBTable>
        </div>
        <b>Registered courses List</b>
        <div className="tableFixHead">
        <MDBTable hover  className='table'>
            <MDBTableHead className='head'>
                <tr>
                    <th>Course Title</th>
                    <th>Course Description</th>
                    <th>Faulty</th>
                    <th>Meeting Time</th>
                    <th>Action</th>
                </tr>
            </MDBTableHead>
            <MDBTableBody className='head'>
                {registeredCourses.length?registeredCourseList():<tr><td colSpan={6}>No course found!</td></tr>}
            </MDBTableBody>
        </MDBTable>
        </div>
    </MDBContainer>
  )
}
