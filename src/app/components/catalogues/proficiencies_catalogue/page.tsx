"use client"
import React, { useState, useEffect } from 'react'
import { Button, Card, Col, Form, ListGroup, ListGroupItem, Row } from 'react-bootstrap';
import '../../../styles/CatalogueCard.css';
import { authFetch } from '../../utils/authFetch';

const ProficienciesCatalogue = () => {

    type Proficiency = {
        id: number;
        level: string;
    };

    const [form, setForm] = useState({
        level: '',
    });

    const [proficiencies, setProficiencies] = useState<Proficiency[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    useEffect(() => {

        const fetchData = async () => {
            try {
                const [proficienciesResponse] = await Promise.all([
                    authFetch("http://localhost:8090/api/proficiencies"),
                ]);

                const proficienciesData = await proficienciesResponse.json();

                setProficiencies(proficienciesData);

                console.log(proficienciesData);
            } catch (error) {
                console.error("Error fetching skill categories", error);
            }
        }

        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("level", form.level);

        try {
            const response = await authFetch(`http://localhost:8090/api/proficiencies`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    level: form.level
                })
            });

            if (response.ok) {
                alert("Proficiency was created successfully!");
                window.location.reload();
            } else {
                alert("Something went wrong!");
                console.log("Info: ", form.level);
            }
        } catch (error) {
            console.error("Error submitting form: ", error);
        }
    };




    return (
        <div>
            <Card className='catalogue-card'>
                <Card.Header>
                    <h1>Proficiencies</h1>
                </Card.Header>
                <Card.Body>
                    <Row className='p-3'>
                        <Col>
                            <Row className='mb-3'>
                                <label>Name</label>
                                <Form.Control name="level" type="text" placeholder="Enter proficiency name..." onChange={handleChange} />
                            </Row>

                            <Row className='mb-5'>
                                <Button variant='primary' onClick={handleSubmit}>Add</Button>
                            </Row>

                            <Row className='mb-3 p-0'>
                                <label>Existing Proficiencies</label>
                                <Col>
                                    <ListGroup className='scrollable-list'>
                                        {proficiencies.map((Proficiency) => (
                                            <ListGroupItem key={Proficiency.id} className='skill-item'>
                                                <Row>
                                                    <Col>{Proficiency.level}</Col>
                                                </Row>
                                            </ListGroupItem>
                                        ))}
                                    </ListGroup>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </div>
    )
}

export default ProficienciesCatalogue;