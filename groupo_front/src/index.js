import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Profil from './components/Profil';
import Navbar from './components/Navbar';
import FormElem from './components/FormElem';
import "normalize.css";
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <Router>
    <Navbar />
    <Routes>
      <Route index element={<Home />} />
      <Route path="/" element={< Home />} />
      <Route path="/form" element={<FormElem />} />
      <Route path="/form/profil" element={< Profil />} />
    </Routes>
  </Router>
  // </React.StrictMode>
);
