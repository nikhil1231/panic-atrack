import "./NaviBar.css";

import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { Link, Route, Routes } from "react-router-dom";

import LogEpisode from "../pages/LogEpisode";
import ListEpisodes from "../pages/ListEpisodes";
import NotFoundPage from "../pages/NotFoundPage";

const Navibar = () => {
  return (
    <>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand as={Link} to="/">
          Logger
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/">
              New
            </Nav.Link>
            <Nav.Link as={Link} to="/list">
              List
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Routes>
        <Route path="/" element={<LogEpisode />} />
        <Route path="/list" element={<ListEpisodes />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default Navibar;
