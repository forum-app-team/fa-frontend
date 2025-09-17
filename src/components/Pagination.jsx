import { Col, Form, Pagination, Row } from "react-bootstrap";

export default function PaginationComponent({
  page = 1,
  limit = 50,
  setPage,
  setLimit,
  prev,
  next,
  pageCount = 1
}) {

  return (<>
    <Row className="align-items-center g-2">
      <Col xs="auto">
        <div className="d-flex align-items-center gap-2">
          <Form.Select
            id="page-size"
            size="sm"
            style={{ width: 80 }}
            value={limit}
            onChange={(e) => setLimit(Number(e.currentTarget.value))}
          >
            {[10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
          </Form.Select>
          <Form.Label htmlFor="page-size" className="mb-0">/ page</Form.Label>
        </div>
      </Col>

      <Col xs="auto" className="ms-auto">
        <Pagination size="sm" className="mb-0">
          <Pagination.First onClick={() => setPage(1)} disabled={page === 1}/>
          <Pagination.Prev onClick={prev} disabled={page === 1}/>
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((i) => (
            <Pagination.Item key={i} active={i === page} onClick={() => setPage(i)}>
              {i}
            </Pagination.Item>
          ))}
          <Pagination.Next onClick={next} disabled={page === pageCount}/>
          <Pagination.Last onClick={() => setPage(pageCount)} disabled={page === pageCount}/>
        </Pagination>
      </Col>
    </Row>
  </>);
};