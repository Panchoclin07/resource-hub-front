"use client"
import React, { useState, useEffect } from 'react'
import { Button, Card, Col, Form, ListGroup, ListGroupItem, Row } from 'react-bootstrap';
import '../../../styles/CatalogueCard.css';
import { authFetch } from '../../utils/authFetch';


const SkillsCatalogue = () => {

    type Category = {
        id: number;
        name: string;
    };

    type Skill = {
        id: number;
        name: string;
        categoryId: number;
        categoryName: string;
    };

    const [form, setForm] = useState({
        name: '',
        categoryId: '',
    });

    const [categories, setCategories] = useState<Category[]>([]);
    const [skills, setSkills] = useState<Skill[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    useEffect(() => {

        const fetchData = async () => {
            try {
                const [categoriesResponse, skillsResponse] = await Promise.all([
                    authFetch("http://localhost:8090/api/categories"),
                    authFetch(`http://localhost:8090/api/skills`),
                ]);

                const categoriesData = await categoriesResponse.json();
                const skillsData = await skillsResponse.json();

                setCategories(categoriesData);
                setSkills(skillsData);

                console.log(categoriesData, skillsData);
            } catch (error) {
                console.error("Error fetching skill categories and/or skills", error);
            }
        }

        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("categoryId", form.categoryId);
        formData.append("name", form.name);

        try {
            const response = await authFetch(`http://localhost:8090/api/skills?categoryId=${form.categoryId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: form.name
                })
            });

            if (response.ok) {
                alert("Skill was created successfully!");
                window.location.reload();
            } else {
                alert("Something went wrong!");
                console.log("Info: ", form.categoryId, form.name);
            }
        } catch (error) {
            console.error("Error submitting form: ", error);
        }
    };




    return (
        <div>
            <Card className='catalogue-card h-100'>
                <Card.Header>
                    <h1>Skills</h1>
                </Card.Header>
                <Card.Body>
                    <Row className='p-3'>
                        <Col>
                            <Row className='mb-3'>
                                <label>Name</label>
                                <Form.Control name="name" type="text" placeholder="Enter skill name..." onChange={handleChange} />
                            </Row>

                            <Row className='mb-5'>
                                <label>Category</label>
                                <Form.Select aria-label="Default select example" name="categoryId" value={form?.categoryId || ""} onChange={handleChange}>
                                    <option value="">Select a category...</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Row>
                            <Row className='mb-5'>
                                <Button variant='primary' onClick={handleSubmit}>Add</Button>
                            </Row>

                            <Row className='mb-3 p-0'>
                                <label>Existing Skills</label>
                                <Col>
                                    <ListGroup className='scrollable-list'>
                                        {skills.map((skill) => (
                                            <ListGroupItem key={skill.id} className='skill-item'>
                                                <Row>
                                                    <Col>{skill.name}</Col>
                                                    <Col>{skill.categoryName}</Col>
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

export default SkillsCatalogue;