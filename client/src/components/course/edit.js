import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { MDBRadio, MDBContainer, MDBTextArea} from 'mdb-react-ui-kit';
import TimePicker from 'react-time-picker';
 
export default function Edit() {
 const [form, setForm] = useState({
    title: "",
    description: "",
    weekday: "",
 });

 const [startTime, changeStartTime] = useState('10:00');
 const [endTime, changeEndTime] = useState('10:00');

 const params = useParams();
 const navigate = useNavigate();
 
 useEffect(() => {
   async function fetchData() {
    
     const id = params.id.toString();
     console.log(id)
     const response = await fetch(`http://localhost:5000/course/${params.id.toString()}`);
 
     if (!response.ok) {
       const message = `An error has occurred: ${response.statusText}`;
       window.alert(message);
       return;
     }
 
     const course = await response.json();
     if (!course) {
       window.alert(`Record with id ${id} not found`);
       navigate("/course");
       return;
     }
 
     setForm(course);
     changeStartTime(course.startTime);
     changeEndTime(course.endTime);
   }
 
   fetchData();
 
   return;
 }, [params.id, navigate]);
 
 // These methods will update the state properties.
 function updateForm(value) {
   return setForm((prev) => {
     return { ...prev, ...value };
   });
 }
 
 async function onSubmit(e) {
   e.preventDefault();
   const editedCourse = { ...form, startTime, endTime };
 
   // This will send a post request to update the data in the database.
   await fetch(`http://localhost:5000/update/${params.id}`, {
     method: "POST",
     body: JSON.stringify(editedCourse),
     headers: {
       'Content-Type': 'application/json'
     },
   });
 
   navigate("/course");
 }
 
 // This following section will display the form that takes input from the user to update the data.
 return (
   <MDBContainer>
     <h4>Update Course</h4>
     <form onSubmit={onSubmit}>
     <div className="form-group">
         <label htmlFor="title">Title</label>
         <input type="text" className="form-control" id="title"
           value={form.title} onChange={(e) => updateForm({ title: e.target.value })}
         />
    </div>
    <br />
    <div className="form-group">
         <label htmlFor="description">Description</label>
         <MDBTextArea placeholder='Description' id='description' rows={1} 
          value={form.description} onChange={(e) => updateForm({ description: e.target.value })}/>
    </div>
    <br />
    <div className="form-group">
         <label>Time</label>
         <div>
          <MDBRadio name='flexRadioDefault'  label='Monday' inline value='Monday'
            checked={form.weekday === "Monday"} onChange={(e) => updateForm({ weekday: e.target.value })}/>
          <MDBRadio name='flexRadioDefault'  label='Tuesday' inline value='Tuesday'
            checked={form.weekday === "Tuesday"} onChange={(e) => updateForm({ weekday: e.target.value })}/>
          <MDBRadio name='flexRadioDefault'  label='Wednesday' inline  value='Wednesday'
            checked={form.weekday === "Wednesday"} onChange={(e) => updateForm({ weekday: e.target.value })}/>
          <MDBRadio name='flexRadioDefault'  label='Thursday' inline value='Thursday'
            checked={form.weekday === "Thursday"} onChange={(e) => updateForm({ weekday: e.target.value })}/>
          <MDBRadio name='flexRadioDefault'  label='Friday' inline value='Friday'
            checked={form.weekday === "Friday"} onChange={(e) => updateForm({ weekday: e.target.value })}/>
          <MDBRadio name='flexRadioDefault'  label='Saturday' inline value='Saturday'
            checked={form.weekday === "Saturday"} onChange={(e) => updateForm({ weekday: e.target.value })}/>
          <MDBRadio name='flexRadioDefault'  label='Sunday' inline value='Sunday'
            checked={form.weekday === "Sunday"} onChange={(e) => updateForm({ weekday: e.target.value })}/>
         </div>
         <br />
         <div>
          <span>Beginning Time </span>
            <TimePicker onChange={changeStartTime} maxTime={endTime} value={startTime} disableClock={true} />
            <span>-------Ending Time </span>
            <TimePicker minTime={startTime} onChange={changeEndTime} value={endTime} disableClock={true} />
          </div>
       </div>
       <br />
 
       <div className="form-group">
         <input
           type="submit"
           value="Update Course"
           className="btn btn-outline-primary"
         />
       </div>
     </form>
   </MDBContainer>
 );
}