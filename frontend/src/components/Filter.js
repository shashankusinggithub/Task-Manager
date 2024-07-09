import React from "react";
import { Form, Row, Col } from "react-bootstrap";

const Filter = ({ filter, setFilter }) => {
  return (
    <Row className="mb-4">
      <Col md={{ span: 4, offset: 4 }}>
        <Form.Group controlId="formFilter">
          <Form.Label>Filter Tasks</Form.Label>
          <Form.Control
            as="select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="form-select"
          >
            <option value="All">All</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </Form.Control>
        </Form.Group>
      </Col>
    </Row>
  );
};

export default Filter;
