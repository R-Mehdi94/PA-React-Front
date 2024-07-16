import { Container, Grid, Box, Text, Link, Heading } from '@chakra-ui/react';
import { FaFacebook, FaTwitter, FaGooglePlus, FaYoutube } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { FaLocationDot } from 'react-icons/fa6';
import '../css/contact.css';

const ContactPage = () => {
    return (
      <Container className="container">
        <Grid className="grid-container">
          <Box className="grid-item">
            <Heading as="h5">Pour nous contacter</Heading>
            <Box className="box">
              <MdEmail className="box-icon" />
              <Text>ecaf@dzbrains.org</Text>
            </Box>
            <Box className="box">
              <FaLocationDot className="box-icon" />
              <Text>50 Rue des Tournelles 75003 Paris</Text>
            </Box>
          </Box>
          <Box className="grid-item">
            <Heading as="h5">ECAF sur les réseaux sociaux</Heading>
            <Box className="box">
              <FaFacebook className="box-icon" />
              <Link href="https://www.facebook.com/dzbrainsorg" target="_blank">Page Facebook</Link>
            </Box>
            <Box className="box">
              <FaTwitter className="box-icon" />
              <Link href="https://twitter.com/dzbrainsorg" target="_blank">Compte Twitter</Link>
            </Box>
            <Box className="box">
              <FaGooglePlus className="box-icon" />
              <Link href="https://workspaceupdates.googleblog.com/2023/04/new-community-features-for-google-chat-and-an-update-currents%20.html" target="_blank">Page Google Plus</Link>
            </Box>
            <Box className="box">
              <FaYoutube className="box-icon" />
              <Link href="https://www.youtube.com/channel/UCt5o2GxenoD4rs2RyLtDRpQ" target="_blank">Chaîne Youtube</Link>
            </Box>
          </Box>
        </Grid>
        <iframe
          title="ECAF Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.999389998581!2d2.363329015675449!3d48.85715057928759!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e1f06b59f81%3A0xc22cf00fa2a80b7b!2s50%20Rue%20des%20Tournelles%2C%2075003%20Paris%2C%20France!5e0!3m2!1sen!2sus!4v1628783125296!5m2!1sen!2sus"
          className="iframe"
          allowFullScreen={false}
          loading="lazy"
        ></iframe>
        <Box className="footer">
          <Text>
            L'ASSOCIATION N'A PAS DE PERMANENCE FIXE, SI VOUS SOUHAITEZ RENCONTRER UN MEMBRE VEUILLEZ NOUS CONTACTER PAR E-MAIL POUR PRENDRE RENDEZ-VOUS
          </Text>
        </Box>
      </Container>
    );
  };

export default ContactPage;