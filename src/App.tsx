
import { FunctionComponent } from 'react'
import Header from './components/Header'
import Navbar from './components/Navbar'
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './components/Page-not-found'
import React from 'react';
import Accueil from './pages/accueil';
import './App.css';
import Demande from './pages/demande';
import Don from './pages/don';

const App: FunctionComponent = () => {
  return (
    <React.StrictMode>
      <Router>
        <div className="App">
          <Navbar />
          

          <Routes>
            <Route path="/" element={<Accueil />} />
             <Route path="/assoEcaf" element={<AssoEcaf />} />
            <Route path="/don" element={<Don />} />
            <Route path="/adherer" element={<Adherer />} />
            <Route path="/demande" element={<Demande />} />
            <Route path="/parainer" element={<Parainer />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
          </div>
      </Router>
      
    </React.StrictMode>
    
  );
};

export default App;

const AssoEcaf: FunctionComponent = () => <div>L'Association ECAF</div>;
const Adherer: FunctionComponent = () => <div>Adherez à ECAF</div>;
const Parainer: FunctionComponent = () => <div>Parrainage adherent</div>;
const Contact: FunctionComponent = () => <div>Nous contacter</div>;