import React from 'react';
import { Container, Typography, Box, Grid, Paper } from '@mui/material';
import '../css/presentationPage.css';
import image1 from '../images/Ecaf.png';
import image2 from '../images/conf.jpg';
import image3 from '../images/Ecaf3.jpg';
import image4 from '../images/Réunion.jpg';
import image5 from '../images/Reunion2.jpg';
import image6 from '../images/salle.jpg';

const PresentationPage: React.FC = () => {
  return (
    <Container>
      <Box my={4}>
        <Typography variant="h3" gutterBottom>
          Association ECAF
        </Typography>

        <Typography variant="h4" gutterBottom>
          Un peu d'historique !
        </Typography>
        <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Typography variant="body1" paragraph>
                Tout a commencé lorsqu’un étudiant algérien a décidé de mettre en place en avril 2012 un groupe Facebook afin de créer un échange et une entraide entre les étudiants algériens venant en France pour poursuivre leur cursus universitaire. Le groupe vite rempli par les intéressés, le besoin de se rencontrer est rapidement survenu au sein des membres, une aventure inattendue allait tout juste démarrer!
              </Typography>
              <Typography variant="body1" paragraph>
                Le jour de se voir est enfin venu, le 19 Mai 2012. Ce jour qui rappelle aux Algériens une date historique, où les étudiants ont quitté leurs universités pour se joindre au combat de libération du Pays, rappelle aux ECAF leur toute première rencontre. Ce tout premier pique-nique au parc de la Villette, à Paris.
              </Typography>
              <Typography variant="body1" paragraph>
                Une trentaine d’étudiants et de cadres étaient au rendez-vous. Ils étaient témoins de la naissance d’une idée qui est devenue une réalité environ un an plus tard, en Mars 2013. L’association des Étudiants et Cadres Algériens de France est officiellement déclarée auprès de la préfecture de Paris.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <img src={image1} alt="Historique" style={{ width: '100%' }} />
            </Grid>
          </Grid>
        </Paper>

        <Typography variant="h4" gutterBottom>
          Missions de l'Association
        </Typography>
        <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
          <Typography variant="body1" paragraph>
            ECAF se présente comme une association au service d’un étudiant ou cadre algérien, présente depuis son arrivée en France, pendant son parcours et même lors de ses démarches de retour en Algérie, pour ceux qui envisagent cette finalité. À cet effet, l’association a pour objectif d’accueillir, d’informer, d’orienter et d’accompagner les étudiants et cadres algériens pendant leurs parcours universitaires ou professionnels. Elle a également pour objectif de créer un échange constructif et des liens d’amitié entre eux.
          </Typography>
          <Typography variant="body1" paragraph>
            Au-delà d’une association, l’ECAF veut réellement s’inscrire dans un processus dynamique; celui du parcours d’un algérien, mais cela n’est possible qu’avec votre participation. Aujourd’hui demandeur, vous serez demain apte à aider et à partager votre expérience. Autrement dit, l’idée de l’ECAF est de penser l’association comme une grande famille, un cycle en perpétuelle évolution et changement, qui ne peut se réaliser qu’avec votre participation.
          </Typography>
          <Typography variant="body1" paragraph>
            <em>“We can’t help everyone but everyone can help someone” – Ronald Reagan. Ce slogan résumerait bien l’esprit de notre association.</em>
          </Typography>
        </Paper>

        <Typography variant="h4" gutterBottom>
          Accueil des Nouveaux Arrivants
        </Typography>
        <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <img src={image2} alt="Accueil" style={{ width: '100%' }} />
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="body1" paragraph>
                L’association accompagne les étudiants dès l’obtention de leur visa, et en partenariat avec “Campus France Algérie”, elle organise à chaque rentrée universitaire une série de permanences d’accueil, d’information et d’orientation pour les nouveaux arrivants. Celles-ci sont encadrées par des bénévoles, qui partagent leurs expériences sous forme de conseils et de formations. Plusieurs aspects sont abordés : études, démarches administratives, logement...
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        <Typography variant="h4" gutterBottom>
          Accompagnement des Étudiants et Cadres
        </Typography>
        <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <img src={image3} alt="Accompagnement" style={{ width: '100%' }} />
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="body1" paragraph>
                Tout au long de l’année, l’association fournit un travail d’accompagnement et de soutien aux étudiants et aux cadres à travers l’organisation d’ateliers d’information, de formation et de coaching ainsi que de rencontres networking. L’association fait intervenir ses bénévoles spécialistes en la matière voire même des spécialistes externes lors de ces échanges.
              </Typography>
              <Typography variant="body1" paragraph>
                En plus de la contribution de ses bénévoles, l’association a mis en place un espace sur les réseaux sociaux pour encourager l’échange, l’entraide, le partage et la solidarité entre ses membres et sympathisants. Cette activité permanente continue l’objet de notre groupe Facebook, comptant aujourd’hui plus de 20 000 membres.
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        <Typography variant="h4" gutterBottom>
          Création de Ponts avec l’Algérie
        </Typography>
        <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <img src={image4} alt="Création de Ponts" style={{ width: '100%' }} />
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="body1" paragraph>
                Notre association accompagne également les jeunes diplômés ou les cadres expérimentés souhaitant retourner en Algérie. Cela se fait à travers la participation à l’organisation des évènements de recrutement, comme le Forum ITN Emploi. Celui-ci permet de mettre en contact les cadres Algériens installés en France et les entreprises nationales ou mixtes installées en Algérie. Notre travail sur celui-ci est le fruit d’un partenariat monté avec le cabinet ITN.
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        <Typography variant="h4" gutterBottom>
          Un peu de Découverte Culturelle et Touristique
        </Typography>
        <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <img src={image5} alt="Découverte Culturelle" style={{ width: '100%' }} />
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="body1" paragraph>
                Par ailleurs, notre association veille également au rayonnement de notre pays en présentant sa richesse culturelle. Dans le même esprit, notre association œuvre à présenter aux Algériens la culture européenne.
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        <Typography variant="h4" gutterBottom>
          Développement de la Vie de l'Association
        </Typography>
        <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
            <img src={image6} alt="Création de Ponts" style={{ width: '100%' }} />
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="body1" paragraph>
                Une organisation est mise en place dans le but d’améliorer le fonctionnement de l’association, plusieurs projets et activités sont menés à l’intérieur de l’association sur différents aspects: les ressources humaines, la trésorerie, la coordination d’un pôle d’action, les membres de l’association, la communication, l’investigation et le système d’information.
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default PresentationPage;