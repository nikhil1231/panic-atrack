import React, { useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  ToggleButtonGroup,
  ToggleButton,
} from "react-bootstrap";
import RangeSlider from "react-bootstrap-range-slider";

const TRIGGERS = ["None", "Hunger", "Tiredness", "Looking around", "Exercise"];

const LogEpisode = (props) => {
  const [severity, setSeverity] = useState(1);
  const [time, setTime] = useState(new Date().toISOString().slice(0, 16));
  const [trigger, setTrigger] = useState(TRIGGERS[0]);
  const [notes, setNotes] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the submission logic here, e.g., send data to an API or save in state
    console.log({ severity, time, trigger, notes });
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <h1>Log Episode</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="severity">
              <Form.Label>Severity: {severity}</Form.Label>
              <RangeSlider
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                min={1}
                max={5}
                step={1}
                tooltip="auto"
                variant="primary"
              />
            </Form.Group>

            <Form.Group controlId="time">
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="datetime-local"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="trigger">
              <Form.Label>Trigger</Form.Label>
              <Form.Check type="hidden" />{" "}
              {/* Hidden input to tie Form.Label to the button group */}
              <ToggleButtonGroup
                type="radio"
                name="triggers"
                value={trigger}
                onChange={(v) => setTrigger(v)}
              >
                {TRIGGERS.map((trig, idx) => (
                  <ToggleButton
                    key={idx}
                    id={`trigger-button-${idx}`}
                    variant="outline-primary"
                    value={trig}
                  >
                    {trig}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Form.Group>

            <Form.Group controlId="notes">
              <Form.Label>Additional Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Log Episode
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LogEpisode;
