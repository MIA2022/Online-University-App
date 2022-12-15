import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';
import { MDBTable, MDBTableHead, MDBTableBody, MDBContainer} from 'mdb-react-ui-kit';
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import { BsArrowLeft } from "react-icons/bs";

const Record = (props) => (
    <tr>
      <td>{props.id}</td>
      <td align="left">
        <Link className="btn btn-link" to={`/details/result/${encodeURIComponent(props.record.title)}`}>{props.record.title}</Link>
      </td>
      <td>{props.record.author}</td>
      <td>{props.record.source.name}</td>
    </tr>
);

export default function Result() {
    const params=useParams();
    var topHeadlinesUrl='https://newsapi.org/v2/top-headlines'
    var newUrl= topHeadlinesUrl+ '?' + params.criteria
    
    const [records, setRecords] = useState([]);

    useEffect(() =>{
        function getRecords() {
            fetch(`${newUrl}`)
            .then(response=>{return response.json()})
            .then(json=>
                {
                  const records=json.articles;
                  setRecords(records);
                }
            )
          }

        getRecords();
 
        return;
    }, [records.length])

    function recordList() {
        return records.map((record, index) => {
          return (
            <Record
              record={record}
              key={index}
              id={index+1}
            />
          );
        });
      }

  return (
    
    <MDBContainer>
        <div>
            <Button variant="outline-success" tag="a" href="/search">
                <BsArrowLeft />Back
            </Button>
        </div>
        <MDBTable className="table table-striped" style={{ marginTop: 20 }}>
            <MDBTableHead>
                <tr>
                  <th>ID</th>
                    <th>Title</th>
                   <th>Author</th>
                    <th>Source</th>
               </tr>
            </MDBTableHead>
            <MDBTableBody>{recordList()}</MDBTableBody>
    </MDBTable>
    </MDBContainer>
  )
}

