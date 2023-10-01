import "./ListEpisodes.css";

import React, { useState, useEffect } from "react";
import { Table, Modal, Button, Container } from "react-bootstrap";
import { getEpisodes, deleteEpisode, formatDate } from "../util";

const ListEpisodes = (props) => {
  const [episodes, setEpisodes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState(null);

  useEffect(() => {
    getEpisodes().then((eps) => setEpisodes(eps));
  }, []);

  const handleDelete = (episodeId) => {
    deleteEpisode(episodeId)
      .then(() => {
        handleClose();
        setEpisodes(episodes.filter((episode) => episode._id !== episodeId));
      })
      .catch((error) => {
        console.error("Error deleting episode:", error);
      });
  };

  const handleClose = () => setShowModal(false);
  const handleShow = (episode) => {
    setSelectedEpisode(episode);
    setShowModal(true);
  };

  return (
    <Container>
      <h2>Logged Episodes</h2>
      <Table>
        <thead>
          <tr>
            <th>Severity</th>
            <th>Time</th>
            <th>Trigger</th>
          </tr>
        </thead>
        <tbody>
          {episodes.map((episode) => (
            <tr key={episode._id} onClick={() => handleShow(episode)}>
              <td className={`severity-${episode.severity}`}>
                {episode.severity}
              </td>
              <td className={`severity-${episode.severity}`}>
                {formatDate(episode.time)}
              </td>
              <td className={`severity-${episode.severity}`}>
                {episode.trigger}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {selectedEpisode && (
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              <strong>Severity:</strong> {selectedEpisode.severity}
            </p>
            <p>
              <strong>Time:</strong> {formatDate(selectedEpisode.time)}
            </p>
            <p>
              <strong>Trigger:</strong> {selectedEpisode.trigger}
            </p>
            <p>
              <strong>Length:</strong> {selectedEpisode.length}
            </p>
            {selectedEpisode.notes && (
              <p>
                <strong>Notes:</strong> {selectedEpisode.notes}
              </p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="danger"
              onClick={() => handleDelete(selectedEpisode._id)}
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default ListEpisodes;
