import "./LogEpisode.css";

import React, { useState } from "react";
import {
  Form,
  Modal,
  Button,
  Container,
  Row,
  Col,
  ToggleButtonGroup,
  ToggleButton,
} from "react-bootstrap";
import RangeSlider from "react-bootstrap-range-slider";
import { insertEpisode } from "../util";

const TRIGGERS = [
  "None",
  "Hunger",
  "Tiredness",
  "Looking around",
  "Exercise",
  "Anxiety",
];
const LENGTHS = ["< 3 secs", "3-7 secs", "> 7 secs"];

const LogEpisode = (props) => {
  const [severity, setSeverity] = useState(1);
  const [timeToggle, setTimeToggle] = useState("Now");
  const [timeInput, setTimeInput] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [trigger, setTrigger] = useState(TRIGGERS[0]);
  const [length, setLength] = useState(LENGTHS[0]);
  const [notes, setNotes] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    let time =
      timeToggle === "Now"
        ? new Date().toISOString()
        : new Date(timeInput + ":00Z").toISOString();

    // Insert the episode data
    try {
      await insertEpisode({ severity, time, length, notes, trigger });
      handleShow("Successfully logged episode!");

      setNotes("");
    } catch (err) {
      console.error("Error logging episode:", err);
      handleShow("Error logging episode.");
    }
  };

  const handleClose = () => setShowModal(false);
  const handleShow = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="severity" className="form-input">
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

            <Form.Group controlId="timeToggle" className="form-input">
              <Form.Label>Time</Form.Label>
              <br />
              <ToggleButtonGroup
                type="radio"
                name="time-option"
                value={timeToggle}
                onChange={(v) => setTimeToggle(v)}
              >
                {["Now", "Past"].map((val, idx) => (
                  <ToggleButton
                    key={idx}
                    id={`time-option-button-${val}`}
                    variant="outline-primary"
                    name="timeToggle"
                    value={val}
                  >
                    {val}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Form.Group>

            {/* Conditional Time Input */}
            {timeToggle === "Past" && (
              <Form.Group controlId="time" className="form-input">
                <Form.Label>Select Past Time</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={timeInput}
                  onChange={(e) => setTimeInput(e.target.value)}
                />
              </Form.Group>
            )}

            <Form.Group controlId="trigger" className="form-input">
              <Form.Label>Trigger</Form.Label>
              <Form.Check type="hidden" />{" "}
              {/* Hidden input to tie Form.Label to the button group */}
              <ToggleButtonGroup
                type="radio"
                name="triggers"
                value={trigger}
                onChange={(v) => setTrigger(v)}
                className="horizontal-wrap-buttons"
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

            <Form.Group controlId="length" className="form-input">
              <Form.Label>Length</Form.Label>
              <Form.Check type="hidden" />{" "}
              {/* Hidden input to tie Form.Label to the button group */}
              <ToggleButtonGroup
                type="radio"
                name="lengths"
                value={length}
                onChange={(v) => setLength(v)}
              >
                {LENGTHS.map((len, idx) => (
                  <ToggleButton
                    key={idx}
                    id={`length-button-${idx}`}
                    variant="outline-primary"
                    value={len}
                  >
                    {len}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Form.Group>

            <Form.Group controlId="notes" className="form-input">
              <Form.Label>Additional Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="submit-button">
              Log
            </Button>
          </Form>
        </Col>
      </Row>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default LogEpisode;
