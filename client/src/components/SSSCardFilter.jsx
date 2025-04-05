import { useState } from "react";
import { Form, Button, Row, Col, Card, Collapse } from "react-bootstrap";
import { ChevronDown, ChevronUp } from "react-bootstrap-icons";

function SSSCardFilter({ applyFilters }) {
  const [nameFilter, setNameFilter] = useState("");
  const [colourFilter, setColourFilter] = useState("");
  const [powerFilter, setPowerFilter] = useState("");
  const [minPower, setMinPower] = useState("");
  const [maxPower, setMaxPower] = useState("");
  const [filterMode, setPowerFilterMode] = useState("exact"); // exact, range, min, max
  const [isOpen, setIsOpen] = useState(false);

  const colourOptions = ["", "red", "blue", "yellow", "purple", "green", "orange", "white"];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let filterParams = {};
    
    if (nameFilter.trim()) {
      filterParams.name = nameFilter.trim();
    }
    
    if (colourFilter) {
      filterParams.colour = colourFilter;
    }
    
    if (filterMode === "exact" && powerFilter.trim()) {
      filterParams.power = parseInt(powerFilter);
    } else if (filterMode === "range" && minPower.trim() && maxPower.trim()) {
      filterParams.minPower = parseInt(minPower);
      filterParams.maxPower = parseInt(maxPower);
    } else if (filterMode === "min" && minPower.trim()) {
      filterParams.minPower = parseInt(minPower);
    } else if (filterMode === "max" && maxPower.trim()) {
      filterParams.maxPower = parseInt(maxPower);
    }
    
    applyFilters(filterParams);
  };
  
  const clearFilters = () => {
    setNameFilter("");
    setColourFilter("");
    setPowerFilter("");
    setMinPower("");
    setMaxPower("");
    setPowerFilterMode("exact");
    applyFilters({});
  };

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Card className="mb-4">
      <Card.Header 
        className="d-flex justify-content-between align-items-center" 
        style={{ cursor: 'pointer' }}
        onClick={toggleCollapse}
      >
        <Card.Title className="mb-0">Filter Cards</Card.Title>
        <Button variant="link" className="p-0">
          {isOpen ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </Card.Header>
      <Collapse in={isOpen}>
        <div>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Card Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Filter by name"
                      value={nameFilter}
                      onChange={(e) => setNameFilter(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Card Colour</Form.Label>
                    <Form.Select
                      value={colourFilter}
                      onChange={(e) => setColourFilter(e.target.value)}
                    >
                      <option value="">All Colours</option>
                      {colourOptions.slice(1).map(colour => (
                        <option key={colour} value={colour}>
                          {colour.charAt(0).toUpperCase() + colour.slice(1)}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Power Filter Type</Form.Label>
                <Form.Select 
                  value={filterMode} 
                  onChange={(e) => setPowerFilterMode(e.target.value)}
                >
                  <option value="exact">Exact Power</option>
                  <option value="range">Power Range</option>
                  <option value="min">Minimum Power</option>
                  <option value="max">Maximum Power</option>
                </Form.Select>
              </Form.Group>

              {filterMode === "exact" && (
                <Form.Group className="mb-3">
                  <Form.Label>Power</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter exact power"
                    value={powerFilter}
                    onChange={(e) => setPowerFilter(e.target.value)}
                  />
                </Form.Group>
              )}

              {filterMode === "range" && (
                <Row className="mb-3">
                  <Col>
                    <Form.Group>
                      <Form.Label>Min Power</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Min power"
                        value={minPower}
                        onChange={(e) => setMinPower(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Max Power</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Max power"
                        value={maxPower}
                        onChange={(e) => setMaxPower(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              )}

              {filterMode === "min" && (
                <Form.Group className="mb-3">
                  <Form.Label>Minimum Power</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter minimum power"
                    value={minPower}
                    onChange={(e) => setMinPower(e.target.value)}
                  />
                </Form.Group>
              )}

              {filterMode === "max" && (
                <Form.Group className="mb-3">
                  <Form.Label>Maximum Power</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter maximum power"
                    value={maxPower}
                    onChange={(e) => setMaxPower(e.target.value)}
                  />
                </Form.Group>
              )}

              <div className="d-flex gap-2">
                <Button variant="primary" type="submit">
                  Apply Filters
                </Button>
                <Button variant="secondary" type="button" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </Form>
          </Card.Body>
        </div>
      </Collapse>
    </Card>
  );
}

export default SSSCardFilter;