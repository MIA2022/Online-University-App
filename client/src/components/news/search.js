import React, {useState} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { MDBTable, MDBTableHead, MDBTableBody, MDBInput, MDBContainer} from 'mdb-react-ui-kit';
import { useNavigate } from "react-router";

export default function Search() {

    const [form, setForm] = useState({
        apiKey:'b91769dba9b14d4f87a663648f930996',
        p: "",
        country: "us",
        category: "general",
    });

    const navigate = useNavigate();

    
    function updateForm(value) {
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    }

    function  handleSubmit(e){
        e.preventDefault()
        const params = { ...form }
        var criteria= new URLSearchParams(params).toString()

        fetch('http://localhost:5000/results',{
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({params:criteria}),         
            })
            .then(response=>{return response.json()})
            .then(json=>{
                if(json.message){
                    window.alert(json.message)
                }else{
                    localStorage.setItem('criteria', criteria)
                    navigate(`/results/${criteria}`);
                }
            })
    }

  return (
    <MDBContainer>
        <MDBTable hover borderless className="search">
            <MDBTableHead>
                <tr>
                    <th scope='col'></th>
                    <th scope='col' className="text-center">Search Top-headlines</th>
                </tr>
            </MDBTableHead>
            <MDBTableBody>
                <tr>
                    <td>Keyword</td>
                    <td>
                        <MDBInput id='typeText' type='text' 
                        value={form.p} 
                        onChange={(e) => updateForm({p: e.target.value })}/>
                    </td>
                </tr>
                <tr>
                    <td>Country</td>
                    <td>
                        {['radio'].map((type) => (
                            <div key={`inline-${type}`} className="mb-3">
                                <Form.Check inline label="cz"name="group1" type={type} id={`inline-${type}-1`}
                                    value="cz" checked={form.country === "cz"}
                                    onChange={(e) => updateForm({ country: e.target.value })}
                                />
                                <Form.Check inline label="de"name="group1" type={type} id={`inline-${type}-2`}
                                    value="de" checked={form.country === "de"}
                                    onChange={(e) => updateForm({ country: e.target.value })}
                                />
                                <Form.Check inline label="fr"name="group1" type={type} id={`inline-${type}-3`}
                                    value="fr" checked={form.country === "fr"}
                                    onChange={(e) => updateForm({ country: e.target.value })}
                                />
                                <Form.Check inline label="us"name="group1" type={type} id={`inline-${type}-4`}
                                    value="us" defaultChecked
                                />
                                <Form.Check inline label="ca"name="group1" type={type} id={`inline-${type}-5`}
                                    value="ca" checked={form.country === "ca"}
                                    onChange={(e) => updateForm({ country: e.target.value })}
                                />
                                <Form.Check inline label="it"name="group1" type={type} id={`inline-${type}-6`}
                                    value="it" checked={form.country === "it"}
                                    onChange={(e) => updateForm({ country: e.target.value })}
                                />
                                <Form.Check inline label="gb"name="group1" type={type} id={`inline-${type}-7`}
                                    value="gb" checked={form.country === "gb"}
                                    onChange={(e) => updateForm({ country: e.target.value })}
                                />
                                <Form.Check inline label="tw"name="group1" type={type} id={`inline-${type}-8`}
                                    value="tw" checked={form.country === "tw"}
                                    onChange={(e) => updateForm({ country: e.target.value })}
                                />
                                <Form.Check inline label="ua"name="group1" type={type} id={`inline-${type}-9`}
                                    value="ua" checked={form.country === "ua"}
                                    onChange={(e) => updateForm({ country: e.target.value })}
                                />
                                <Form.Check inline label="za"name="group1" type={type} id={`inline-${type}-10`}
                                    value="za" checked={form.country === "za"}
                                    onChange={(e) => updateForm({ country: e.target.value })}
                                />
                            </div>
                        ))}
                    </td>
                </tr>
                <tr>
                    <td>Category</td>
                    <td>
                        {['radio'].map((type) => (
                            <div key={`inline-${type}`} className="mb-3">
                                <Form.Check inline label="business"name="group2" type={type} id={`inline-${type}-1`}
                                    value="business" checked={form.category=== "business"}
                                    onChange={(e) => updateForm({ category: e.target.value })}
                                />
                                <Form.Check inline label="entertainment"name="group2" type={type} id={`inline-${type}-2`}
                                    value="entertainment" checked={form.category === "entertainment"}
                                    onChange={(e) => updateForm({ category: e.target.value })}
                                />
                                <Form.Check inline label="general"name="group2" type={type} id={`inline-${type}-3`}
                                    value="general" defaultChecked
                                />
                                <Form.Check inline label="health"name="group2" type={type} id={`inline-${type}-4`}
                                    value="health" checked={form.category === "health"}
                                    onChange={(e) => updateForm({ category: e.target.value })}
                                />
                                <Form.Check inline label="science"name="group2" type={type} id={`inline-${type}-5`}
                                    value="science" checked={form.category === "science"}
                                    onChange={(e) => updateForm({ category: e.target.value })}
                                />
                                <Form.Check inline label="sports"name="group2" type={type} id={`inline-${type}-6`}
                                    value="sports" checked={form.category === "sports"}
                                    onChange={(e) => updateForm({ category: e.target.value})}
                                />
                                <Form.Check inline label="technology"name="group2" type={type} id={`inline-${type}-7`}
                                    value="technology" checked={form.category === "technology"}
                                    onChange={(e) => updateForm({ category: e.target.value })}
                                />
                            </div>
                        ))}
                    </td>
                </tr>
                <tr>
                    <th></th>
                    <td  className="text-center">
                        <Container>
                            <Row >
                                <Col col="6">
                                {/* <Link className="btn btn-link" to={'/results/1'} >Edit</Link> */}
                                    <Button  tag="a" href="/search" variant="outline-danger" >
                                        Reset
                                    </Button>
                                </Col>
                                <Col col="6">
                                    
                                    <Button  variant="outline-success"  onClick={handleSubmit} >
                                        Submit
                                    </Button> 
                                </Col>
                            </Row>
                        </Container>            
                    </td>
                </tr>

            </MDBTableBody>
            
        </MDBTable>

    </MDBContainer>

  )
}
