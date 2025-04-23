import React, { useEffect } from 'react'
import SkillsCatalogue from './skills_catalogue/page';
import CategoriesCatalogue from './categories_catalogue/page';
import ProficienciesCatalogue from './proficiencies_catalogue/page';
import { Container, Row, Col } from 'react-bootstrap';

const Catalogues = () => {

    return (
        <div>
            <Container>
                <Row className='"justify-content-center align-items-stretch'>
                    <Col md={4}>
                        <SkillsCatalogue />
                    </Col>
                    <Col md={4}>
                        <CategoriesCatalogue />
                    </Col>
                    <Col md={4}>
                        <ProficienciesCatalogue />
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Catalogues;