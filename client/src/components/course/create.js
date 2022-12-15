import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MDBRadio, MDBContainer, MDBTextArea} from 'mdb-react-ui-kit';
import TimePicker from 'react-time-picker';


export default function Create() {
  let email=localStorage.getItem('user-info')
  const [form, setForm] = useState({
      title: "",
      description: "",
      weekday: "Monday",
      email:email
  });
  const [startTime, changeStartTime] = useState('10:00');
  const [endTime, changeEndTime] = useState('10:00');

  const navigate = useNavigate();

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }
 
  // This function will handle the submission.
  async function onSubmit(e) {
    e.preventDefault();
    
    // When a post request is sent to the create url, we'll add a new record to the database.
    const newCourse = { ...form, startTime, endTime };
      console.log(newCourse)
    await fetch("http://localhost:5000/createCourse", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCourse),
    }).catch(error => {
      window.alert(error);
      return;
    });
  
    setForm({ title: "", description: "", weekday: "" });
    changeStartTime('10:00')
    changeEndTime('10:00')
    navigate("/course");
  }
 
  // This following section will display the form that takes the input from the user.
  return (
    <MDBContainer>
      <h4>Create New Course</h4>
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
            <MDBRadio name='flexRadioDefault'  label='Monday'  inline value='Monday'
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
            value="Create course"
            className="btn btn-outline-primary"
          />
        </div>
      </form>
    
    </MDBContainer>
    
  );
}