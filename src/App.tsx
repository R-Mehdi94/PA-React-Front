import { FunctionComponent, useState } from 'react';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './components/Page-not-found';
import React from 'react';
import Accueil from './pages/accueil';
import './App.css';
import Demande from './pages/demande';
import Don from './pages/don';
import StripeProvider from './components/StripeProvider';
import Adherer from './pages/subscription';
import Evenement from './pages/evenement';
import PresentationPage from './pages/presentationPage';
import ContactPage from './pages/contact';
import Login from './pages/login';
import MyDonations from './components/InterfaceUser/MyDonations';
import MyEvents from './components/InterfaceUser/MyEvents';
import MySponsor from './components/InterfaceUser/MySponsor';
import MySubscriptions from './components/InterfaceUser/MySubscriptions';
import ProfileDetails from './components/InterfaceUser/ProfileDetails';
import MyRequest from './components/InterfaceUser/Myrequests';



const App: FunctionComponent = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  return (
    <React.StrictMode>
      <Router>
        <div className="App">
          <Navbar />
          
          <StripeProvider>
            <Routes>
              <Route path="/" element={<Accueil />} />
              <Route path="assoEcaf" element={<PresentationPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/evenement" element={<Evenement />} />
              <Route path="/don" element={<Don />} />
              <Route path="/adherer" element={<Adherer />} />
              <Route path="/demande" element={<Demande />} />
              <Route path="/login" element={<Login />}/>
              <Route path="/profil/details" element={<ProfileDetails />} />
              <Route path="/profil/events" element={<MyEvents />} />
              <Route path="/profil/donations" element={<MyDonations />} />
              <Route path="/profil/subscriptions" element={<MySubscriptions />} />
              <Route path="/profil/sponsor" element={<MySponsor />} />
              <Route path="/profil/requests" element={<MyRequest />} />

              <Route path="*" element={<PageNotFound />} />

              
            </Routes>
          </StripeProvider>

          {isChatbotOpen && (
            <div className="chatbot-container">
              <iframe
                allow="microphone;"
                width="350"
                height="430"
                src="https://console.dialogflow.com/api-client/demo/embedded/c9fca898-05f1-48e2-8934-23f94dc7498a"
              ></iframe>
            </div>
          )}

          <button className="chatbot-button" onClick={toggleChatbot}>
            <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="35" height="35"><path xmlns="http://www.w3.org/2000/svg" d="m19,4h-1.101c-.465-2.279-2.485-4-4.899-4H5C2.243,0,0,2.243,0,5v12.854c0,.794.435,1.52,1.134,1.894.318.171.667.255,1.015.255.416,0,.831-.121,1.19-.36l2.95-1.967c.691,1.935,2.541,3.324,4.711,3.324h5.697l3.964,2.643c.36.24.774.361,1.19.361.348,0,.696-.085,1.015-.256.7-.374,1.134-1.1,1.134-1.894v-12.854c0-2.757-2.243-5-5-5ZM2.23,17.979c-.019.012-.075.048-.152.007-.079-.042-.079-.109-.079-.131V5c0-1.654,1.346-3,3-3h8c1.654,0,3,1.346,3,3v7c0,1.654-1.346,3-3,3h-6c-.327,0-.541.159-.565.175l-4.205,2.804Zm19.77,3.876c0,.021,0,.089-.079.131-.079.041-.133.005-.151-.007l-4.215-2.811c-.164-.109-.357-.168-.555-.168h-6c-1.304,0-2.415-.836-2.828-2h4.828c2.757,0,5-2.243,5-5v-6h1c1.654,0,3,1.346,3,3v12.854Z"/></svg>
          </button>
        </div>
      </Router>
    </React.StrictMode>
  );
};




export default App;


