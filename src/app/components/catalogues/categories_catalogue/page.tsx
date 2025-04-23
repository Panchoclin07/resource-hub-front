"use client"
import React, { useState, useEffect } from 'react'
import { Button, Card, Col, Form, ListGroup, ListGroupItem, Row } from 'react-bootstrap';
import '../../../styles/CatalogueCard.css';
import { authFetch } from '../../utils/authFetch';


const CategoriesCatalogue = () => {

    type Category = {
        id: number;
        name: string;
    };

    const [form, setForm] = useState({
        name: '',
    });

    const [categories, setCategories] = useState<Category[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    useEffect(() => {

        const fetchData = async () => {
            try {
                const [categoriesResponse] = await Promise.all([
                    authFetch("http://localhost:8090/api/categories"),
                ]);

                const categoriesData = await categoriesResponse.json();

                setCategories(categoriesData);

                console.log(categoriesData);
            } catch (error) {
                console.error("Error fetching skill categories", error);
            }
        }

        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", form.name);

        try {
            const response = await authFetch(`http://localhost:8090/api/categories`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: form.name
                })
            });

            if (response.ok) {
                alert("Category was created successfully!");
                window.location.reload();
            } else {
                alert("Something went wrong!");
                console.log("Info: ", form.name);
            }
        } catch (error) {
            console.error("Error submitting form: ", error);
        }
    };




    return (
        <div>
            <Card className='catalogue-card h-100'>
                <Card.Header>
                    <h1>Categories</h1>
                </Card.Header>
                <Card.Body>
                    <Row className='p-3'>
                        <Col>
                            <Row className='mb-3'>
                                <label>Name</label>
                                <Form.Control name="name" type="text" placeholder="Enter category name..." onChange={handleChange} />
                            </Row>

                            <Row className='mb-5'>
                                <Button variant='primary' onClick={handleSubmit}>Add</Button>
                            </Row>

                            <Row className='mb-3 p-0'>
                                <label>Existing Catalogues</label>
                                <Col>
                                    <ListGroup className='scrollable-list'>
                                        {categories.map((category) => (
                                            <ListGroupItem key={category.id} className='skill-item'>
                                                <Row>
                                                    <Col>{category.name}</Col>
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

export default CategoriesCatalogue;