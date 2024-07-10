import React from "react";
import { Form, Button, Row, Col } from "react-bootstrap";

const Filter = ({
  filter,
  setFilter,
  sortBy,
  setSortBy,
  order,
  setOrder,
  searchQuery,
  setSearchQuery,
  handleSearch,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  return (
    <Form
      className="mb-4 bg-secondary border-dark rounded text-white p-3 border border-5"
      onSubmit={handleSubmit}
    >
      <Row>
        <Col md={3}>
          <Form.Group controlId="formFilter">
            <Form.Label>Filter Tasks</Form.Label>
            <Form.Control
              as="select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group controlId="formSortBy">
            <Form.Label>Sort By</Form.Label>
            <Form.Control
              as="select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="title">Title</option>
              <option value="due_date">Due Date</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group controlId="formOrder">
            <Form.Label>Order</Form.Label>
            <Form.Control
              as="select"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group controlId="formSearchQuery">
            <Form.Label>Search</Form.Label>
            <Form.Control
              type="text"
              placeholder="Search Tasks"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-2 ">
            Search
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default Filter;
